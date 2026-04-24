import Link from "next/link";
import { ArrowLeft, Truck, MapPin, Clock, Package, Phone, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Shipping Information — BlessedOgoVik Fab",
};

const NIGERIAN_ZONES = [
  { zone: "Lagos", timeline: "1–3 business days" },
  { zone: "South-West (Ogun, Oyo, Osun, Ekiti, Ondo)", timeline: "2–4 business days" },
  { zone: "South-East (Imo, Anambra, Enugu, Ebonyi, Abia)", timeline: "2–4 business days" },
  { zone: "South-South (Rivers, Delta, Edo, Cross River, Akwa Ibom, Bayelsa)", timeline: "3–5 business days" },
  { zone: "North-Central (FCT, Kogi, Kwara, Niger, Benue, Plateau, Nasarawa)", timeline: "4–6 business days" },
  { zone: "North-West (Kano, Kaduna, Katsina, Sokoto, Kebbi, Zamfara, Jigawa)", timeline: "4–7 business days" },
  { zone: "North-East (Adamawa, Bauchi, Borno, Gombe, Taraba, Yobe)", timeline: "5–7 business days" },
];

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Shipping Information
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          Everything you need to know about how we deliver your order.
        </p>

        <div className="space-y-8">

          {/* Flat rate */}
          <section className="bg-orange-50 border border-orange-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Truck className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                Flat Rate Shipping — ₦1,500
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We charge a single flat delivery fee of <strong>₦1,500</strong> on
              every order, regardless of size or weight. No surprises at checkout.
              This rate applies to all 36 states in Nigeria and the FCT.
            </p>
          </section>

          {/* Delivery timeline by zone */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Estimated Delivery Times by Zone
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Timelines are in business days from the date your order is dispatched
              (not from the date of purchase).
            </p>
            <div className="border rounded-xl overflow-hidden">
              {NIGERIAN_ZONES.map((z, i) => (
                <div
                  key={z.zone}
                  className={`flex items-center justify-between px-5 py-3.5 text-sm ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <span className="text-gray-700">{z.zone}</span>
                  <span className="text-orange-600 font-medium whitespace-nowrap ml-4">
                    {z.timeline}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Timelines are estimates and may vary during public holidays or peak
              seasons.
            </p>
          </section>

          {/* Dispatch process */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              How We Process Your Order
            </h2>
            <div className="space-y-3">
              {[
                "You place your order and complete payment via Paystack.",
                "We confirm your order and begin preparing your fabric — same or next business day.",
                "Your order is handed to our courier partner and a tracking number is assigned.",
                "You receive your tracking number on your order page so you can follow the delivery.",
                "Your fabric arrives at your door. Inspect it upon delivery.",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-xs font-bold mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What we cover */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Coverage
            </h2>
            <div className="space-y-2">
              {[
                "All 36 Nigerian states and the FCT",
                "Residential and commercial addresses",
                "Order tracking number provided for every shipment",
                "Orders dispatched Monday to Saturday",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Local pickup */}
          <section className="border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-500" />
              Local Pickup (Free)
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Prefer to collect your order in person? Select{" "}
              <strong>&ldquo;Pickup at Store&rdquo;</strong> during checkout — no
              delivery fee applies. Your order will be ready within one business
              day of payment.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-1">
              <p className="font-semibold">BlessedOgoVik Fab Store</p>
              <p>MAB 30 Main line Shopping Center, Aba, Abia State</p>
              <p className="text-gray-500">Mon – Sat: 8:00 AM – 7:00 PM</p>
              <p className="text-gray-500">Sunday: 10:00 AM – 4:00 PM</p>
            </div>
          </section>

          {/* Delays & issues */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Phone className="h-5 w-5 text-orange-500" />
              Delayed or Missing Orders
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If your order has not arrived within the estimated window, please
              check your tracking number first. If the issue persists, contact
              us and we will investigate with the courier immediately.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a
                href="tel:+2348037340545"
                className="inline-flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                <Phone className="h-4 w-4" />
                08037340545
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                Contact Form →
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
