import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { orders, orderItems, products, categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import OrderStatusBadge from "@/components/orders/order-status-badge";
import { formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ArrowLeft, MapPin, Phone, Package, Truck } from "lucide-react";

type OrderItemWithProduct = {
  id: number;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  productName: string | null;
  productSlug: string | null;
  productImages: string[] | null;
  productUnit: string | null;
  categoryName: string | null;
};

interface OrderDetailPageProps {
  params: { id: string };
  searchParams: { success?: string };
}

export default async function OrderDetailPage({
  params,
  searchParams,
}: OrderDetailPageProps) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const orderId = parseInt(params.id);
  if (isNaN(orderId)) notFound();

  const order = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.clerkUserId, userId)))
    .limit(1);

  if (!order[0]) notFound();

  const items: OrderItemWithProduct[] = await db
    .select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      unitPrice: orderItems.unitPrice,
      subtotal: orderItems.subtotal,
      productName: products.name,
      productSlug: products.slug,
      productImages: products.images,
      productUnit: products.unit,
      categoryName: categories.name,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(orderItems.orderId, orderId));

  const currentOrder = order[0];
  const isSuccess = searchParams.success === "true";

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Success Banner */}
      {isSuccess && (
        <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-4">
          <CheckCircle className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-green-800 text-lg mb-1">
              Order Placed Successfully!
            </h2>
            <p className="text-green-700 text-sm">
              Thank you for your order. We&apos;ll process it shortly and
              contact you at the provided phone number to confirm delivery.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{currentOrder.id}
          </h1>
          <OrderStatusBadge status={currentOrder.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              Order Items
            </h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {item.productImages?.[0] ? (
                      <Image
                        src={item.productImages[0]}
                        alt={item.productName || "Product"}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-2xl">
                        🧵
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/shop/${item.productSlug || ""}`}
                      className="font-medium text-gray-900 hover:text-orange-500 transition-colors"
                    >
                      {item.productName}
                    </Link>
                    {item.categoryName && (
                      <p className="text-xs text-gray-500">
                        {item.categoryName}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      {item.quantity} {item.productUnit || "yard"}(s) ×{" "}
                      {formatNaira(parseFloat(item.unitPrice))}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">
                      {formatNaira(parseFloat(item.subtotal))}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>
                  {formatNaira(
                    parseFloat(currentOrder.totalAmount) -
                      parseFloat(currentOrder.shippingFee ?? "1500")
                  )}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping fee</span>
                <span>{formatNaira(parseFloat(currentOrder.shippingFee ?? "1500"))}</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-orange-500">
                  {formatNaira(parseFloat(currentOrder.totalAmount))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Delivery / Pickup Info */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              {currentOrder.fulfillmentType === "pickup" ? "Pickup" : "Delivery Address"}
            </h2>
            {currentOrder.fulfillmentType === "pickup" ? (
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">In-Store Pickup</p>
                <p>MAB 30 Main line Shopping Center, Aba, Abia State</p>
              </div>
            ) : (
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{currentOrder.deliveryAddress}</p>
                <p>{currentOrder.deliveryCity}, {currentOrder.deliveryState}</p>
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="h-4 w-4 text-orange-500" />
              Contact
            </h2>
            <p className="text-sm text-gray-600">{currentOrder.phone}</p>
          </div>

          {/* Tracking */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="h-4 w-4 text-orange-500" />
              Shipment Tracking
            </h2>
            {currentOrder.trackingNumber ? (
              <div className="space-y-1">
                <p className="text-sm font-mono font-medium text-gray-900">
                  {currentOrder.trackingNumber}
                </p>
                <p className="text-xs text-gray-500">
                  Use this number to track your package with the courier.
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                A tracking number will appear here once your order has been
                dispatched.
              </p>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Payment
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Status</span>
                <span className={currentOrder.paymentStatus === "paid" ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>
                  {currentOrder.paymentStatus || "Pending"}
                </span>
              </div>
              {currentOrder.paymentReference && (
                <div className="flex justify-between text-gray-600">
                  <span>Reference</span>
                  <span className="font-mono text-xs">
                    {currentOrder.paymentReference}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="text-xs text-gray-400">
            Placed on{" "}
            {new Date(currentOrder.createdAt).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
