import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Return Policy — BlessedOgoVik Fab",
};

export default function ReturnPolicyPage() {
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

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Return Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: April 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Overview</h2>
            <p className="text-gray-600 leading-relaxed">
              At BlessedOgoVik Fab, we want you to be completely satisfied with
              your purchase. If for any reason you are not happy with your order,
              we are here to help. Please read our return policy carefully before
              making a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Return Window
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You have <strong>7 days</strong> from the date of delivery to
              initiate a return. After 7 days have passed, we are unable to
              accept a return or issue a refund.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Eligibility Conditions
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              To be eligible for a return, your item must meet all of the
              following conditions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>The item must be unused and in the same condition that you received it.</li>
              <li>The item must be in its original packaging.</li>
              <li>The fabric must not have been cut, washed, ironed, or altered in any way.</li>
              <li>You must have proof of purchase (your order number).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Non-Returnable Items
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              The following items cannot be returned:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Items that have been cut, washed, or altered.</li>
              <li>Items marked as &ldquo;Final Sale&rdquo; or &ldquo;Non-Returnable&rdquo; at the time of purchase.</li>
              <li>Items damaged by the customer after delivery.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Defective or Wrong Items
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you received a defective, damaged, or incorrect item, please
              contact us within 48 hours of delivery with photos of the item and
              your order number. In such cases, we will cover the return shipping
              cost and issue a full refund or replacement at no extra charge.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Return Shipping
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Unless the item is defective or incorrect, the customer is
              responsible for return shipping costs. We recommend using a
              trackable shipping service. We cannot guarantee receipt of your
              returned item without tracking.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Refunds</h2>
            <p className="text-gray-600 leading-relaxed">
              Once your return is received and inspected, we will notify you of
              the approval or rejection of your refund. If approved, your refund
              will be processed via Paystack reversal to your original payment
              method within <strong>5–7 business days</strong>. The original
              shipping fee of ₦1,500 is non-refundable unless the item was
              defective or incorrectly sent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              How to Initiate a Return
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              To start a return, please contact us through one of the following:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>
                Email:{" "}
                <a
                  href="mailto:mwodovoctoria234@gmail.com"
                  className="text-orange-500 hover:text-orange-600"
                >
                  mwodovoctoria234@gmail.com
                </a>
              </li>
              <li>
                Phone:{" "}
                <a
                  href="tel:+2348037340545"
                  className="text-orange-500 hover:text-orange-600"
                >
                  08037340545
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-orange-500 hover:text-orange-600">
                  Contact Form
                </Link>
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Please include your order number and the reason for the return in
              your message.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
