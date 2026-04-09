"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { Category } from "@/types";

interface ShopFiltersProps {
  categories: Category[];
  /** Mirrors server `searchParams` so highlights stay in sync with RSC data */
  category: string;
  color: string;
  min: string;
  max: string;
  inStock: boolean;
  sort?: string;
  featured?: string;
}

type ShopQueryState = Pick<
  ShopFiltersProps,
  "category" | "color" | "min" | "max" | "inStock" | "sort" | "featured"
>;

function buildShopQueryParams(s: ShopQueryState): URLSearchParams {
  const p = new URLSearchParams();
  if (s.category) p.set("category", s.category);
  if (s.color) p.set("color", s.color);
  if (s.min) p.set("min", s.min);
  if (s.max) p.set("max", s.max);
  if (s.inStock) p.set("inStock", "true");
  if (s.sort) p.set("sort", s.sort);
  if (s.featured) p.set("featured", s.featured);
  return p;
}

const COLORS = [
  "Ivory", "White", "Gold", "Silver", "Rose Gold", "Champagne",
  "Navy Blue", "Wine", "Royal Blue", "Emerald", "Coral", "Black",
  "Blush Pink", "Burgundy", "Purple",
];

const PRICE_RANGES = [
  { label: "All Prices", min: "", max: "" },
  { label: "Under ₦5,000", min: "", max: "5000" },
  { label: "₦5,000 – ₦10,000", min: "5000", max: "10000" },
  { label: "₦10,000 – ₦20,000", min: "10000", max: "20000" },
  { label: "Above ₦20,000", min: "20000", max: "" },
];

export default function ShopFilters({
  categories,
  category: activeCategory,
  color: activeColor,
  min: priceMin,
  max: priceMax,
  inStock: inStockOnly,
  sort,
  featured,
}: ShopFiltersProps) {
  const router = useRouter();

  const baseQuery: ShopQueryState = {
    category: activeCategory,
    color: activeColor,
    min: priceMin,
    max: priceMax,
    inStock: inStockOnly,
    sort,
    featured,
  };

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = buildShopQueryParams({
        category: activeCategory,
        color: activeColor,
        min: priceMin,
        max: priceMax,
        inStock: inStockOnly,
        sort,
        featured,
      });
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`/shop?${params.toString()}`);
      router.refresh();
    },
    [
      router,
      activeCategory,
      activeColor,
      priceMin,
      priceMax,
      inStockOnly,
      sort,
      featured,
    ]
  );

  const activePriceLabel = PRICE_RANGES.find(
    (r) => r.min === priceMin && r.max === priceMax
  )?.label || "All Prices";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-gray-900 font-semibold">
        <SlidersHorizontal className="h-4 w-4 text-orange-500" />
        Filters
      </div>

      {/* Lace Type */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Lace Type
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={() => updateFilter("category", null)}
            className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
              !activeCategory
                ? "bg-orange-500 text-white font-medium"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category", cat.slug)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                activeCategory === cat.slug
                  ? "bg-orange-500 text-white font-medium"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Price Range
        </h3>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() => {
                const params = buildShopQueryParams(baseQuery);
                if (range.min) params.set("min", range.min);
                else params.delete("min");
                if (range.max) params.set("max", range.max);
                else params.delete("max");
                params.delete("page");
                router.push(`/shop?${params.toString()}`);
                router.refresh();
              }}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                activePriceLabel === range.label
                  ? "bg-orange-500 text-white font-medium"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Color
        </h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() =>
                updateFilter("color", activeColor === color ? null : color)
              }
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeColor === color
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-gray-200 hover:border-orange-300 text-gray-600"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) =>
              updateFilter("inStock", e.target.checked ? "true" : null)
            }
            className="h-4 w-4 accent-orange-500 rounded"
          />
          <span className="text-sm text-gray-700">In Stock Only</span>
        </label>
      </div>

      {/* Reset */}
      {(activeCategory || activeColor || priceMin || priceMax || inStockOnly) && (
        <button
          onClick={() => {
            router.push("/shop");
            router.refresh();
          }}
          className="w-full text-sm text-orange-500 hover:text-orange-600 underline text-left"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
