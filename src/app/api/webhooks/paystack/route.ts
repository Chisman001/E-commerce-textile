import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  // Verify HMAC SHA-512 signature
  const expectedSignature = crypto
    .createHmac("sha512", secret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const reference: string = event.data?.reference;
    if (reference) {
      await db
        .update(orders)
        .set({ paymentStatus: "paid", status: "processing" })
        .where(eq(orders.paymentReference, reference));
    }
  }

  return NextResponse.json({ received: true });
}
