import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const { type: eventType } = evt;

  if (eventType === "user.created") {
    const { id, first_name, last_name, phone_numbers } = evt.data;
    const fullName =
      [first_name, last_name].filter(Boolean).join(" ") || null;
    const phone = phone_numbers?.[0]?.phone_number || null;

    await db.insert(profiles).values({
      clerkUserId: id,
      fullName,
      phone,
    });
  }

  if (eventType === "user.updated") {
    const { id, first_name, last_name, phone_numbers } = evt.data;
    const fullName =
      [first_name, last_name].filter(Boolean).join(" ") || null;
    const phone = phone_numbers?.[0]?.phone_number || null;

    await db
      .update(profiles)
      .set({ fullName, phone })
      .where(eq(profiles.clerkUserId, id));
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (id) {
      await db.delete(profiles).where(eq(profiles.clerkUserId, id));
    }
  }

  return new Response("Webhook processed", { status: 200 });
}
