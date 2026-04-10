import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import ProductImageGallery from "@/components/shop/product-image-gallery";
import AddToCartButton from "@/components/shop/add-to-cart-button";
import QuantitySelector from "@/components/shop/quantity-selector";
import ProductCard from "@/components/shop/product-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatNaira } from "@/lib/utils";
import { Package, Palette, Layers, Ruler, ArrowLeft } from "lucide-react";
import type { Product } from "@/types";

interface ProductPageProps {
  params: { slug: string };
}

async function getProduct(slug: string) {
  const result = await db
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
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);

  return result[0] as Product | undefined;
}

async function getRelatedProducts(categoryId: number, currentSlug: string) {
  const result = await db
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
    .where(
      and(
        eq(products.categoryId, categoryId),
        ne(products.slug, currentSlug),
        eq(products.isActive, true)
      )
    )
    .limit(4);

  return result as Product[];
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} — BlesseOgoVIk Fab`,
    description: product.description || undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.slug
  );

  const specs = [
    { icon: Layers, label: "Material", value: product.material },
    { icon: Palette, label: "Color", value: product.color },
    { icon: Package, label: "Pattern", value: product.pattern },
    { icon: Ruler, label: "Unit", value: product.unit },
  ].filter((s) => s.value);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-orange-500">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-orange-500">
          Shop
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-orange-500"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <ProductImageGallery
          images={product.images || []}
          productName={product.name}
        />

        {/* Details */}
        <div className="space-y-6">
          {product.category && (
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="text-sm text-orange-500 font-medium uppercase tracking-wide hover:underline"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-orange-500">
              {formatNaira(parseFloat(product.price))}
            </span>
            <span className="text-gray-400">/ {product.unit || "yard"}</span>
          </div>

          {product.description && (
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          )}

          {/* Specs */}
          {specs.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center gap-2 bg-gray-50 rounded-lg p-3"
                >
                  <spec.icon className="h-4 w-4 text-orange-400 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400">{spec.label}</div>
                    <div className="text-sm font-medium text-gray-900">
                      {spec.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Separator />

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.stockQuantity > 0 ? (
              <>
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="text-sm text-green-700 font-medium">
                  In Stock ({product.stockQuantity} available)
                </span>
              </>
            ) : (
              <>
                <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="text-sm text-red-600 font-medium">
                  Out of Stock
                </span>
              </>
            )}
          </div>

          {/* Quantity + Cart */}
          {product.stockQuantity > 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Quantity (yards)
                </label>
                <QuantitySelector max={Math.min(product.stockQuantity, 50)} />
              </div>
              <AddToCartButton product={product} quantity={1} />
            </div>
          )}

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              🚚 Free delivery over ₦50,000
            </Badge>
            <Badge variant="outline" className="text-xs">
              🔄 7-day return policy
            </Badge>
            <Badge variant="outline" className="text-xs">
              ✅ Authenticated fabric
            </Badge>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            More from {product.category?.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href={`/shop?category=${product.category?.slug}`}
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              View all {product.category?.name}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
