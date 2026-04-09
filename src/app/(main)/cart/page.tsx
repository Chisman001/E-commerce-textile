"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { formatNaira } from "@/lib/utils";
import CartItem from "@/components/cart/cart-item";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items, clearCart, totalPrice } = useCartStore();
  const total = totalPrice();

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag className="h-20 w-20 text-gray-200 mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven&apos;t added any fabrics yet.
          </p>
          <Button
            asChild
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border p-6">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
              <div className="mt-4">
                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-600 underline"
                >
                  Clear all items
                </button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-xl border p-6 space-y-4 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                  <span>{formatNaira(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">
                    Calculated at checkout
                  </span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-orange-500">{formatNaira(total)}</span>
              </div>
              <Button
                asChild
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-base"
              >
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/shop">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
