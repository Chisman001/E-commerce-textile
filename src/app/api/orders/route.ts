import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

const DELIVERY_FEE = 1500;
const PICKUP_FEE = 0;

type VerifiedPaystackTransaction = {
  amount: number;
  currency: string;
  reference: string;
  status: string;
};

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: VerifiedPaystackTransaction;
};

const createOrderSchema = z
  .object({
    items: z.array(
      z.object({
        id: z.number().int().positive(),
        quantity: z.number().int().min(1),
      })
    ).min(1),
    fulfillmentType: z.enum(["delivery", "pickup"]).default("delivery"),
    deliveryAddress: z.string().min(5).optional(),
    deliveryCity: z.string().min(2).optional(),
    deliveryState: z.string().min(2).optional(),
    phone: z.string().min(10),
    paymentReference: z.string().trim().min(1).optional(),
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
  expectedAmountKobo: number
) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    }
  );

  if (!res.ok) {
    return false;
  }

  const payload = (await res.json()) as PaystackVerifyResponse;
  const transaction = payload.data;

  return (
    payload.status === true &&
    transaction?.status === "success" &&
    transaction.reference === reference &&
    transaction.currency === "NGN" &&
    transaction.amount === expectedAmountKobo
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
    const paymentReference = data.paymentReference ?? null;

    if (paymentReference) {
      const [existingOrder] = await db
        .select({ id: orders.id })
        .from(orders)
        .where(eq(orders.paymentReference, paymentReference))
        .limit(1);

      if (existingOrder) {
        return NextResponse.json(
          { error: "Payment reference has already been used" },
          { status: 409 }
        );
      }

      const isVerified = await verifyPaystackPayment(
        paymentReference,
        Math.round(totalAmount * 100)
      );

      if (!isVerified) {
        return NextResponse.json(
          { error: "Payment verification failed" },
          { status: 402 }
        );
      }
    }

    const [order] = await db
      .insert(orders)
      .values({
        clerkUserId: userId,
        status: "pending",
        fulfillmentType: data.fulfillmentType,
        totalAmount: totalAmount.toString(),
        shippingFee: shippingFee.toString(),
        deliveryAddress: data.deliveryAddress || null,
        deliveryCity: data.deliveryCity || null,
        deliveryState: data.deliveryState || null,
        phone: data.phone,
        paymentReference,
        paymentStatus: paymentReference ? "paid" : "pending",
      })
      .returning();

    await db.insert(orderItems).values(
      lineItems.map((li) => ({ ...li, orderId: order.id }))
    );

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (err) {
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
