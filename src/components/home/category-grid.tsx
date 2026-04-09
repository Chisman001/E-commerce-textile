import Link from "next/link";
import type { Category } from "@/types";

const categoryColors: Record<string, string> = {
  "french-lace": "from-rose-300 to-pink-500",
  "cord-lace": "from-yellow-400 to-amber-500",
  "guipure-lace": "from-slate-500 to-gray-700",
  "swiss-lace": "from-sky-300 to-blue-400",
  "venice-lace": "from-purple-400 to-violet-600",
  "sequence-lace": "from-pink-400 to-rose-600",
  "embroidered-net": "from-teal-400 to-cyan-600",
  "metallic-lace": "from-yellow-300 to-yellow-600",
};

const categoryEmojis: Record<string, string> = {
  "french-lace": "🌸",
  "cord-lace": "🪡",
  "guipure-lace": "✂️",
  "swiss-lace": "💎",
  "venice-lace": "🌹",
  "sequence-lace": "✨",
  "embroidered-net": "🎀",
  "metallic-lace": "💛",
};

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Shop by Lace Type
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Explore our luxury beaded lace collections, each type hand-picked
            for elegance and prestige.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group"
            >
              <div className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div
                  className={`bg-gradient-to-br ${
                    categoryColors[category.slug] || "from-gray-400 to-gray-600"
                  } p-8 flex flex-col items-center justify-center text-white text-center group-hover:scale-[1.02] transition-transform`}
                >
                  <span className="text-4xl mb-3">
                    {categoryEmojis[category.slug] || "🧵"}
                  </span>
                  <h3 className="font-bold text-lg">{category.name}</h3>
                </div>
                <div className="p-3 bg-gray-50">
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
