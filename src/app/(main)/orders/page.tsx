import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import OrderStatusBadge from "@/components/orders/order-status-badge";
import { formatNaira } from "@/lib/utils";
import { Package, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function OrdersPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.clerkUserId, userId))
    .orderBy(desc(orders.createdAt));

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {userOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package className="h-20 w-20 text-gray-200 mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            No orders yet
          </h2>
          <p className="text-gray-500 mb-8">
            You haven&apos;t placed any orders. Start shopping to see your
            orders here.
          </p>
          <Button
            asChild
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Link href="/shop">Browse Fabrics</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white border rounded-xl p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">
                      Order #{order.id}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-gray-500">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    Delivery: {order.deliveryCity}, {order.deliveryState}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-500">
                      {formatNaira(parseFloat(order.totalAmount))}
                    </p>
                    <p className="text-xs text-gray-400">
                      Payment: {order.paymentStatus || "pending"}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
