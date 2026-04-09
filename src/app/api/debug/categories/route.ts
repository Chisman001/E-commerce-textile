import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";

/**
 * Dev-only: returns category rows from the same DB connection as Server Components.
 * Compare with Neon SQL: SELECT id, name, slug FROM categories ORDER BY id;
 * Remove or keep disabled in production.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(categories)
    .orderBy(asc(categories.id));

  const host = (() => {
    const raw = process.env.DATABASE_URL;
    if (!raw) return null;
    try {
      return new URL(raw.replace(/^postgres:/, "postgresql:")).hostname;
    } catch {
      return "(unparseable DATABASE_URL)";
    }
  })();

  return NextResponse.json({
    count: rows.length,
    databaseHost: host,
    categories: rows,
  });
}
