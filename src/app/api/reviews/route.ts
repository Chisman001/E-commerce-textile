import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const createReviewSchema = z.object({
  productId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  body: z.string().min(5, "Review must be at least 5 characters"),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = parseInt(searchParams.get("productId") || "");

  if (isNaN(productId)) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const productReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt));

  return NextResponse.json({ reviews: productReviews });
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in to leave a review" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = createReviewSchema.parse(body);

    const [review] = await db
      .insert(reviews)
      .values({
        productId: data.productId,
        clerkUserId: userId,
        rating: data.rating,
        title: data.title || null,
        body: data.body,
      })
      .returning();

    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    console.error("Review creation error:", err);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
