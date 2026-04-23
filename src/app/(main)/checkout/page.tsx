"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { ShieldCheck, Loader2, Truck } from "lucide-react";

const SHIPPING_FEE = 1500;

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
  "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara",
];

interface FormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  general?: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isLoaded && user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
      }));
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const subtotal = totalPrice();
  const grandTotal = subtotal + SHIPPING_FEE;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim() || formData.phone.length < 10)
      newErrors.phone = "Enter a valid phone number";
    if (!formData.address.trim() || formData.address.length < 5)
      newErrors.address = "Enter your street address";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "Select your state";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrder = async (paymentReference: string) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        deliveryAddress: formData.address,
        deliveryCity: formData.city,
        deliveryState: formData.state,
        phone: formData.phone,
        shippingFee: SHIPPING_FEE,
        paymentReference,
      }),
    });

    if (!res.ok) throw new Error("Order creation failed");
    const { orderId } = await res.json();
    clearCart();
    router.push(`/orders/${orderId}?success=true`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!user) return;

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) {
      setErrors({ general: "No email address found on your account." });
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      setErrors({ general: "Payment configuration error. Please contact support." });
      return;
    }

    setIsSubmitting(true);

    try {
      // Dynamically import Paystack (browser-only library)
      const PaystackPop = (await import("@paystack/inline-js")).default;
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: publicKey,
        email,
        amount: grandTotal * 100, // Paystack uses kobo
        currency: "NGN",
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: formData.fullName,
            },
            {
              display_name: "Phone",
              variable_name: "phone",
              value: formData.phone,
            },
          ],
        },
        onSuccess: async (transaction: { reference: string }) => {
          try {
            await createOrder(transaction.reference);
          } catch {
            setErrors({ general: "Payment received but order creation failed. Please contact us with your payment reference: " + transaction.reference });
            setIsSubmitting(false);
          }
        },
        onCancel: () => {
          setIsSubmitting(false);
        },
      });
    } catch {
      setErrors({ general: "Could not initialize payment. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Delivery Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="e.g. Adaeze Okonkwo"
                    className="mt-1.5"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+234 801 234 5678"
                    className="mt-1.5"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="e.g. 15 Awolowo Road, Ikoyi"
                    className="mt-1.5"
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="e.g. Lagos"
                    className="mt-1.5"
                  />
                  {errors.city && (
                    <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select state</option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-xs text-red-500 mt-1">{errors.state}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Notice */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3">
              <Truck className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-sm text-orange-700">
                <p className="font-semibold mb-1">Flat Rate Shipping — {formatNaira(SHIPPING_FEE)}</p>
                <p>
                  We deliver across all Nigerian states. Standard delivery takes
                  3–7 business days. You will receive a tracking number once your
                  order is dispatched.
                </p>
              </div>
            </div>

            {/* Payment Notice */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">Secure Payment via Paystack</p>
                <p>
                  Your payment is processed securely by Paystack. We accept bank
                  transfers, cards, and USSD.
                </p>
              </div>
            </div>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                {errors.general}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl border p-6 space-y-4 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>
              <Separator />

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × {formatNaira(item.price)}
                      </p>
                    </div>
                    <span className="text-sm font-medium whitespace-nowrap">
                      {formatNaira(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery fee</span>
                  <span className="text-orange-600 font-medium">{formatNaira(SHIPPING_FEE)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-orange-500">{formatNaira(grandTotal)}</span>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting to Payment...
                  </>
                ) : (
                  `Pay ${formatNaira(grandTotal)}`
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
