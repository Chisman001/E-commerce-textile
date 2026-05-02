import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

const SHIPPING_FEES = {
  delivery: 1500,
  pickup: 0,
} as const;

type PaystackTransactionVerification = {
  status: boolean;
  data?: {
    status?: string;
    amount?: number;
    currency?: string;
    reference?: string;
  };
};

const createOrderSchema = z
  .object({
    items: z.array(
      z.object({
        id: z.number(),
        quantity: z.number().min(1),
      })
    ),
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

async function verifyPaystackPayment(reference: string, expectedAmount: number) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("Missing PAYSTACK_SECRET_KEY");
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${secret}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as PaystackTransactionVerification;
  const expectedAmountKobo = Math.round(expectedAmount * 100);

  return (
    result.status === true &&
    result.data?.status === "success" &&
    result.data.reference === reference &&
    result.data.currency === "NGN" &&
    result.data.amount === expectedAmountKobo
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
    const shippingFee = SHIPPING_FEES[data.fulfillmentType];

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

    const totalAmount = subtotal + shippingFee;

    const existingOrder = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.paymentReference, data.paymentReference))
      .limit(1);

    if (existingOrder[0]) {
      return NextResponse.json(
        { error: "Payment reference has already been used" },
        { status: 409 }
      );
    }

    const paymentIsVerified = await verifyPaystackPayment(
      data.paymentReference,
      totalAmount
    );

    if (!paymentIsVerified) {
      return NextResponse.json(
        { error: "Payment could not be verified" },
        { status: 402 }
      );
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
        paymentReference: data.paymentReference,
        paymentStatus: "paid",
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
