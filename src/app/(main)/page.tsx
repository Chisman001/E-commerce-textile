import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import HeroSection from "@/components/home/hero-section";
import CategoryGrid from "@/components/home/category-grid";
import FeaturedProducts from "@/components/home/featured-products";
import TrustSection from "@/components/home/trust-section";
import type { Product, Category } from "@/types";

async function getHomeData() {
  const [allCategories, featuredProducts] = await Promise.all([
    db
      .select()
      .from(categories)
      .orderBy(asc(categories.id))
      .limit(8),
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
      .where(eq(products.isFeatured, true))
      .orderBy(desc(products.createdAt))
      .limit(8),
  ]);

  return {
    categories: allCategories as Category[],
    featuredProducts: featuredProducts as Product[],
  };
}

export default async function HomePage() {
  const { categories: allCategories, featuredProducts } = await getHomeData();

  return (
    <>
      <HeroSection />
      <CategoryGrid categories={allCategories} />
      <FeaturedProducts products={featuredProducts} />
      <TrustSection />
    </>
  );
}
