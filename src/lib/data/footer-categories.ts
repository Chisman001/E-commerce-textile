import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";

const FOOTER_CATEGORY_LIMIT = 5;

export async function getFooterCategories() {
  return db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(categories)
    .orderBy(asc(categories.id))
    .limit(FOOTER_CATEGORY_LIMIT);
}
