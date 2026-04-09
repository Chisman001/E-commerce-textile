"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatNaira } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CartItem from "./cart-item";

export default function CartSidebar() {
  const { items, isOpen, closeCart, totalPrice } = useCartStore();
  const total = totalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-orange-500" />
            Shopping Cart
            {items.length > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-200 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Discover our premium fabric collection
            </p>
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600"
              onClick={closeCart}
            >
              <Link href="/shop">Browse Fabrics</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-2">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatNaira(total)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600">Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-orange-500">{formatNaira(total)}</span>
                </div>
              </div>

              <Button
                asChild
                className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-base"
                onClick={closeCart}
              >
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={closeCart}
                asChild
              >
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
