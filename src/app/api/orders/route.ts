import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";

const DELIVERY_FEE = 1500;
const PICKUP_FEE = 0;

interface PaystackVerification {
  status: boolean;
  data?: {
    amount?: number;
    currency?: string;
    reference?: string;
    status?: string;
    customer?: {
      email?: string;
    };
  };
}

class PaymentReferenceAlreadyUsedError extends Error {}

const createOrderSchema = z
  .object({
    items: z.array(
      z.object({
        id: z.number(),
        quantity: z.number().min(1),
      })
    ).min(1),
    fulfillmentType: z.enum(["delivery", "pickup"]).default("delivery"),
    deliveryAddress: z.string().min(5).optional(),
    deliveryCity: z.string().min(2).optional(),
    deliveryState: z.string().min(2).optional(),
    phone: z.string().min(10),
    paymentReference: z.string().min(1),
  })
  .refine(
    (data) => {
      if (data.fulfillmentType === "delivery") {
        return !!data.deliveryAddress && !!data.deliveryCity && !!data.deliveryState;
      }
      return true;
    },
    { message: "Delivery address, city, and state are required for delivery orders" }
  );

async function verifyPaystackPayment(
  reference: string,
  expectedAmount: number,
  expectedEmail: string
) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("Missing PAYSTACK_SECRET_KEY");
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${secret}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return false;
  }

  const verification = (await res.json()) as PaystackVerification;
  const transaction = verification.data;

  return (
    verification.status === true &&
    transaction?.status === "success" &&
    transaction.reference === reference &&
    transaction.currency === "NGN" &&
    transaction.amount === Math.round(expectedAmount * 100) &&
    transaction.customer?.email?.toLowerCase() === expectedEmail.toLowerCase()
  );
}

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = createOrderSchema.parse(body);
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "No email address found on this account" },
        { status: 400 }
      );
    }

    const productIds = data.items.map((i) => i.id);
    const foundProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    const productMap = new Map(foundProducts.map((p) => [p.id, p]));

    let subtotal = 0;
    const lineItems = data.items.map((item) => {
      const product = productMap.get(item.id);
      if (!product) throw new Error(`Product not found: ${item.id}`);
      const unitPrice = parseFloat(product.price);
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;
      return {
        productId: item.id,
        quantity: item.quantity,
        unitPrice: unitPrice.toString(),
        subtotal: itemSubtotal.toString(),
      };
    });

    const shippingFee = data.fulfillmentType === "pickup" ? PICKUP_FEE : DELIVERY_FEE;
    const totalAmount = subtotal + shippingFee;

    const isPaymentValid = await verifyPaystackPayment(
      data.paymentReference,
      totalAmount,
      email
    );

    if (!isPaymentValid) {
      return NextResponse.json(
        { error: "Payment could not be verified" },
        { status: 402 }
      );
    }

    const order = await db.transaction(async (tx) => {
      await tx.execute(
        sql`select pg_advisory_xact_lock(hashtext(${data.paymentReference}))`
      );

      const [existingOrder] = await tx
        .select({ id: orders.id })
        .from(orders)
        .where(eq(orders.paymentReference, data.paymentReference))
        .limit(1);

      if (existingOrder) {
        throw new PaymentReferenceAlreadyUsedError();
      }

      const [createdOrder] = await tx.insert(orders).values({
        clerkUserId: userId,
        status: "processing",
        fulfillmentType: data.fulfillmentType,
        totalAmount: totalAmount.toString(),
        shippingFee: shippingFee.toString(),
        deliveryAddress: data.deliveryAddress || null,
        deliveryCity: data.deliveryCity || null,
        deliveryState: data.deliveryState || null,
        phone: data.phone,
        paymentReference: data.paymentReference,
        paymentStatus: "paid",
      }).returning();

      await tx.insert(orderItems).values(
        lineItems.map((li) => ({ ...li, orderId: createdOrder.id }))
      );

      return createdOrder;
    });

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (err) {
    if (err instanceof PaymentReferenceAlreadyUsedError) {
      return NextResponse.json(
        { error: "Payment reference has already been used" },
        { status: 409 }
      );
    }

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: err.issues },
        { status: 400 }
      );
    }
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
