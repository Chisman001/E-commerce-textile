"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ShoppingCart, Menu, X, Scissors } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/orders", label: "My Orders" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, toggleCart } = useCartStore();
  const itemCount = totalItems();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
            <Scissors className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">BlesseOgoVIk Fab</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-orange-500",
                pathname === link.href
                  ? "text-orange-500"
                  : "text-gray-600"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Cart button */}
          <button
            onClick={toggleCart}
            className="relative p-2 rounded-full hover:bg-orange-50 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[11px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {/* Auth */}
          <SignedOut>
            <SignInButton mode="redirect">
              <Button
                size="sm"
                className="hidden md:flex bg-orange-500 hover:bg-orange-600 text-white"
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </SignedIn>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block text-sm font-medium py-2 transition-colors hover:text-orange-500",
                pathname === link.href ? "text-orange-500" : "text-gray-600"
              )}
            >
              {link.label}
            </Link>
          ))}
          <SignedOut>
            <SignInButton mode="redirect">
              <Button
                size="sm"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2"
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      )}
    </header>
  );
}
