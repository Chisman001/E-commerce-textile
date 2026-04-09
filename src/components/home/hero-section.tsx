import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #f43f5e,
              #f43f5e 2px,
              transparent 2px,
              transparent 20px
            )`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <Star className="h-3.5 w-3.5 fill-current" />
              Premium Luxury Beaded Lace
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Draped in the World&apos;s{" "}
              <span className="text-rose-500">Finest Luxury Beaded Lace</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              From exquisite French Lace to dramatic Cord Lace, structured
              Guipure, dazzling Sequence Lace, and ultra-luxurious Metallic Lace
              — discover over 33 handpicked designs for every special occasion.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="bg-rose-500 hover:bg-rose-600 text-white px-8"
              >
                <Link href="/shop">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8">
                <Link href="/shop?featured=true">View Featured</Link>
              </Button>
            </div>

            {/* Trust stats */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">33+</div>
                <div className="text-sm text-gray-500">Lace Designs</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-sm text-gray-500">Lace Types</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-500">Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Image collage */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden h-48 bg-gradient-to-br from-rose-300 to-pink-500 shadow-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🌸</div>
                  <div className="font-semibold">French Lace</div>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden h-32 bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-3xl mb-1">🪡</div>
                  <div className="font-semibold text-sm">Cord Lace</div>
                </div>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="rounded-2xl overflow-hidden h-32 bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-3xl mb-1">✨</div>
                  <div className="font-semibold text-sm">Sequence Lace</div>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden h-48 bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">💛</div>
                  <div className="font-semibold">Metallic Lace</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
