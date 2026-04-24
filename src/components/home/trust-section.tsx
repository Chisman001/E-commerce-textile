import { Shield, Truck, RefreshCw, Star, Phone } from "lucide-react";
import NewsletterSection from "./newsletter-section";

const trustFeatures = [
  {
    icon: Shield,
    title: "Authentic Quality",
    description: "Every lace is sourced directly and verified for authenticity and quality.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "Fast and reliable delivery to all 36 states across Nigeria.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "Not satisfied? Return within 7 days for a full refund or exchange.",
  },
  {
    icon: Phone,
    title: "Expert Support",
    description: "Our lace experts are available 6 days a week to help you choose the perfect design.",
  },
];

const testimonials = [
  {
    name: "Adaeze Okonkwo",
    location: "Enugu",
    text: "The Ivory French Lace I ordered was absolutely breathtaking! Perfect for my traditional wedding. The bead detailing is even more stunning in person.",
    rating: 5,
  },
  {
    name: "Fatima Al-Hassan",
    location: "Kano",
    text: "BlessedOgoVik Fab has the finest lace collection I have ever seen. The Gold Metallic Lace I got for my daughter's wedding was the talk of the ceremony.",
    rating: 5,
  },
  {
    name: "Chinwe Eze",
    location: "Lagos",
    text: "Ordered the Gold Cord Lace for my event. Everyone kept asking where I got it! The 3D embroidery is unreal. Will definitely order again.",
    rating: 5,
  },
];

export default function TrustSection() {
  return (
    <>
      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Why Shop with BlessedOgoVik Fab?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              We are committed to bringing you the finest luxury beaded lace with
              a shopping experience you can trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-2xl bg-orange-50 hover:bg-orange-100 transition-colors"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              What Our Customers Say
            </h2>
            <p className="text-gray-500">
              Join hundreds of satisfied customers across Nigeria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-white rounded-2xl p-6 shadow-sm border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-orange-400 text-orange-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-500">{testimonial.location}, Nigeria</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
