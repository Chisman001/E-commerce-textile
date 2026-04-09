"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  quantity: number;
}

export default function AddToCartButton({
  product,
  quantity,
}: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(product.price),
        image: product.images?.[0] || "",
        unit: product.unit || "yard",
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (product.stockQuantity === 0) {
    return (
      <Button disabled className="w-full h-12 text-base" size="lg">
        Out of Stock
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      className={`w-full h-12 text-base ${
        added
          ? "bg-green-500 hover:bg-green-500"
          : "bg-orange-500 hover:bg-orange-600"
      } text-white`}
      size="lg"
    >
      {added ? (
        <>
          <Check className="mr-2 h-5 w-5" />
          Added to Cart!
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
