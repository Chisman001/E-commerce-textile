"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  avgRating?: number;
  reviewCount?: number;
}

export default function ProductCard({ product, avgRating, reviewCount }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.price),
      image: product.images?.[0] || "/placeholder.jpg",
      unit: product.unit || "yard",
    });
  };

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.images && product.images[0] ? (
            <Image
              key={`${product.id}-${product.images[0]}`}
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
              <span className="text-4xl">🧵</span>
            </div>
          )}

          {product.isFeatured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-orange-500 text-white text-xs">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            </div>
          )}

          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="mb-1">
            {product.category && (
              <span className="text-xs text-orange-500 font-medium uppercase tracking-wide">
                {product.category.name}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>
          {avgRating !== undefined && reviewCount !== undefined && reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(avgRating)
                      ? "fill-orange-400 text-orange-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-400 ml-0.5">({reviewCount})</span>
            </div>
          )}
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-orange-500">
                {formatNaira(parseFloat(product.price))}
              </span>
              <span className="text-xs text-gray-400 ml-1">
                / {product.unit || "yard"}
              </span>
            </div>
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white h-8 w-8 p-0"
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
