import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { inArray } from "drizzle-orm";

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
    shippingFee: z.number().default(1500),
    paymentReference: z.string().optional(),
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

    const totalAmount = subtotal + data.shippingFee;

    const [order] = await db
      .insert(orders)
      .values({
        clerkUserId: userId,
        status: "pending",
        fulfillmentType: data.fulfillmentType,
        totalAmount: totalAmount.toString(),
        shippingFee: data.shippingFee.toString(),
        deliveryAddress: data.deliveryAddress || null,
        deliveryCity: data.deliveryCity || null,
        deliveryState: data.deliveryState || null,
        phone: data.phone,
        paymentReference: data.paymentReference || null,
        paymentStatus: data.paymentReference ? "paid" : "pending",
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
