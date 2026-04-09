import { cn, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        ORDER_STATUS_COLORS[status] || "bg-gray-100 text-gray-800"
      )}
    >
      {ORDER_STATUS_LABELS[status] || status}
    </span>
  );
}
