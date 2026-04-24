"use client";

import { useEffect, useState } from "react";
import { formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Package, Truck } from "lucide-react";
import Link from "next/link";

type Order = {
  id: number;
  clerkUserId: string;
  status: string;
  fulfillmentType: string | null;
  totalAmount: string;
  shippingFee: string | null;
  deliveryAddress: string | null;
  deliveryCity: string | null;
  deliveryState: string | null;
  phone: string;
  paymentReference: string | null;
  paymentStatus: string | null;
  trackingNumber: string | null;
  createdAt: string;
};

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const fulfillmentColors: Record<string, string> = {
  delivery: "bg-blue-50 text-blue-700",
  pickup: "bg-green-50 text-green-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [edits, setEdits] = useState<Record<number, { trackingNumber: string; status: string }>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders ?? []);
        const initial: Record<number, { trackingNumber: string; status: string }> = {};
        for (const o of data.orders ?? []) {
          initial[o.id] = { trackingNumber: o.trackingNumber ?? "", status: o.status };
        }
        setEdits(initial);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (orderId: number) => {
    const edit = edits[orderId];
    if (!edit) return;
    setSaving(orderId);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingNumber: edit.trackingNumber || undefined,
          status: edit.status,
        }),
      });

      if (res.ok) {
        const { order } = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? order : o)));
        setSaved((prev) => ({ ...prev, [orderId]: true }));
        setTimeout(() => setSaved((prev) => ({ ...prev, [orderId]: false })), 2000);
      }
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/admin/product-images" className="text-sm text-orange-500 hover:text-orange-600">
          Product Images →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const edit = edits[order.id] ?? { trackingNumber: "", status: order.status };
            const isSaving = saving === order.id;
            const wasSaved = saved[order.id];

            return (
              <div key={order.id} className="bg-white rounded-xl border p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Package className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold text-gray-900">Order #{order.id}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {order.status}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${fulfillmentColors[order.fulfillmentType ?? "delivery"] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {order.fulfillmentType === "pickup" ? "Pickup" : "Delivery"}
                    </span>
                    {order.paymentStatus === "paid" ? (
                      <Badge className="bg-green-100 text-green-800 text-xs">Paid</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">Unpaid</Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="text-gray-400">Delivery: </span>
                    {order.deliveryAddress}, {order.deliveryCity}, {order.deliveryState}
                  </div>
                  <div>
                    <span className="text-gray-400">Phone: </span>{order.phone}
                  </div>
                  <div>
                    <span className="text-gray-400">Total: </span>
                    <span className="font-medium text-orange-500">
                      {formatNaira(parseFloat(order.totalAmount))}
                    </span>
                  </div>
                  {order.paymentReference && (
                    <div>
                      <span className="text-gray-400">Ref: </span>
                      <span className="font-mono text-xs">{order.paymentReference}</span>
                    </div>
                  )}
                </div>

                {/* Editable fields */}
                <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                      <Truck className="h-3 w-3" /> Tracking Number
                    </label>
                    <Input
                      value={edit.trackingNumber}
                      onChange={(e) =>
                        setEdits((prev) => ({
                          ...prev,
                          [order.id]: { ...edit, trackingNumber: e.target.value },
                        }))
                      }
                      placeholder="e.g. GIG-123456789"
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                      Order Status
                    </label>
                    <select
                      value={edit.status}
                      onChange={(e) =>
                        setEdits((prev) => ({
                          ...prev,
                          [order.id]: { ...edit, status: e.target.value },
                        }))
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => handleSave(order.id)}
                    disabled={isSaving}
                    className={`min-w-[100px] ${wasSaved ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"} text-white`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Saving...
                      </>
                    ) : wasSaved ? (
                      "Saved!"
                    ) : (
                      <>
                        <Save className="mr-2 h-3 w-3" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
