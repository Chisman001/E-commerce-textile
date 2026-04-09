"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  onChange?: (quantity: number) => void;
  max?: number;
}

export default function QuantitySelector({
  onChange,
  max = 20,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  const update = (val: number) => {
    const clamped = Math.max(1, Math.min(max, val));
    setQuantity(clamped);
    onChange?.(clamped);
  };

  return (
    <div className="flex items-center border rounded-lg overflow-hidden w-fit">
      <button
        onClick={() => update(quantity - 1)}
        disabled={quantity <= 1}
        className="px-4 py-2.5 hover:bg-gray-100 disabled:opacity-40 transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="px-5 py-2.5 font-semibold text-base min-w-[48px] text-center border-x">
        {quantity}
      </span>
      <button
        onClick={() => update(quantity + 1)}
        disabled={quantity >= max}
        className="px-4 py-2.5 hover:bg-gray-100 disabled:opacity-40 transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
