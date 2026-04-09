import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { products } from "@/db/schema";
import { isAdminUser } from "@/lib/admin";

const patchBodySchema = z.object({
  images: z.array(z.string().url()).min(1),
});

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminUser(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const slug = params.slug;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const row = await db
    .select({
      slug: products.slug,
      name: products.name,
      images: products.images,
    })
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!row[0]) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    slug: row[0].slug,
    name: row[0].name,
    images: row[0].images ?? [],
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminUser(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const slug = params.slug;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { images } = patchBodySchema.parse(body);

    const updated = await db
      .update(products)
      .set({ images })
      .where(eq(products.slug, slug))
      .returning({ id: products.id });

    if (updated.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
