import { Suspense } from "react";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, and, gte, lte, ilike, desc, asc, sql } from "drizzle-orm";
import ShopFilters from "@/components/shop/shop-filters";
import ProductGrid from "@/components/shop/product-grid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product, Category } from "@/types";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: {
    category?: string;
    color?: string;
    min?: string;
    max?: string;
    inStock?: string;
    sort?: string;
    featured?: string;
  };
}

function shopProductGridKey(sp: ShopPageProps["searchParams"]): string {
  return [
    sp.category ?? "",
    sp.color ?? "",
    sp.min ?? "",
    sp.max ?? "",
    sp.inStock ?? "",
    sp.sort ?? "",
    sp.featured ?? "",
  ].join("|");
}

async function getShopData(searchParams: ShopPageProps["searchParams"]) {
  const conditions = [eq(products.isActive, true)];

  if (searchParams.category) {
    const cat = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, searchParams.category))
      .limit(1);
    if (cat[0]) {
      conditions.push(eq(products.categoryId, cat[0].id));
    }
  }

  if (searchParams.color) {
    conditions.push(ilike(products.color, `%${searchParams.color}%`));
  }

  if (searchParams.min) {
    conditions.push(gte(products.price, searchParams.min));
  }

  if (searchParams.max) {
    conditions.push(lte(products.price, searchParams.max));
  }

  if (searchParams.inStock === "true") {
    conditions.push(gte(products.stockQuantity, 1));
  }

  if (searchParams.featured === "true") {
    conditions.push(eq(products.isFeatured, true));
  }

  const orderBy =
    searchParams.sort === "price-asc"
      ? asc(sql`CAST(${products.price} AS NUMERIC)`)
      : searchParams.sort === "price-desc"
      ? desc(sql`CAST(${products.price} AS NUMERIC)`)
      : desc(products.createdAt);

  const [allCategories, allProducts] = await Promise.all([
    db.select().from(categories),
    db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        price: products.price,
        categoryId: products.categoryId,
        images: products.images,
        stockQuantity: products.stockQuantity,
        material: products.material,
        pattern: products.pattern,
        color: products.color,
        unit: products.unit,
        isFeatured: products.isFeatured,
        isActive: products.isActive,
        createdAt: products.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          imageUrl: categories.imageUrl,
        },
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(orderBy),
  ]);

  return {
    categories: allCategories as Category[],
    products: allProducts as Product[],
  };
}

function SortControl() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { categories: allCategories, products: allProducts } =
    await getShopData(searchParams);

  const activeCategory = allCategories.find(
    (c) => c.slug === searchParams.category
  );

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {activeCategory ? activeCategory.name : "All Lace"}
        </h1>
        <p className="text-gray-500">
          {allProducts.length} design{allProducts.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="lg:w-56 shrink-0">
          <Suspense>
            <ShopFilters
              categories={allCategories}
              category={searchParams.category ?? ""}
              color={searchParams.color ?? ""}
              min={searchParams.min ?? ""}
              max={searchParams.max ?? ""}
              inStock={searchParams.inStock === "true"}
              sort={searchParams.sort}
              featured={searchParams.featured}
            />
          </Suspense>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex justify-end mb-6">
            <SortControl />
          </div>
          <ProductGrid key={shopProductGridKey(searchParams)} products={allProducts} />
        </div>
      </div>
    </div>
  );
}
