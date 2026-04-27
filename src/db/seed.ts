import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { categoriesData, productsData } from "../lib/data/seed-data";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🌱 Seeding database...");

  console.log("Inserting categories...");
  const insertedCategories = await db
    .insert(schema.categories)
    .values(categoriesData)
    .onConflictDoNothing()
    .returning();

  console.log(`✅ Inserted ${insertedCategories.length} categories`);

  const allCategories = await db.select().from(schema.categories);
  const categoryMap = new Map(allCategories.map((c) => [c.slug, c.id]));

  console.log("Upserting products (insert new or update price/name/fields on slug conflict; images preserved)...");
  let processedCount = 0;

  for (const product of productsData) {
    const categoryId = categoryMap.get(product.categorySlug);
    if (!categoryId) {
      console.warn(`Category not found for slug: ${product.categorySlug}`);
      continue;
    }

    // categorySlug is only for resolving categoryId, not a DB column
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- omit from insert payload
    const { categorySlug, ...productData } = product;

    await db
      .insert(schema.products)
      .values({
        ...productData,
        categoryId,
      })
      .onConflictDoUpdate({
        target: schema.products.slug,
        set: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          categoryId,
          stockQuantity: productData.stockQuantity,
          material: productData.material,
          pattern: productData.pattern,
          color: productData.color,
          unit: productData.unit,
          isFeatured: productData.isFeatured,
        },
      });

    processedCount++;
  }

  console.log(`✅ Upserted ${processedCount} products`);
  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
