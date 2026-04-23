import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service — BlesseOgoVIk Fab",
};

export default function TermsOfServicePage() {
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
          Terms of Service
        </h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: April 2026</p>

        <div className="space-y-8">

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Acceptance of Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using the BlesseOgoVIk Fab website, placing an
              order, or creating an account, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do
              not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              About Our Products
            </h2>
            <p className="text-gray-600 leading-relaxed">
              BlesseOgoVIk Fab sells premium luxury beaded lace and textile
              fabrics. All products are subject to availability. We reserve the
              right to discontinue any product at any time. Product images are
              for illustrative purposes; slight variations in colour may occur
              due to photography and screen settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Ordering and Payment
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>
                You must create an account and be at least 18 years old to
                place an order.
              </li>
              <li>
                All prices are displayed in Nigerian Naira (₦) and are
                inclusive of any applicable fees.
              </li>
              <li>
                A flat shipping fee of ₦1,500 applies to all orders across
                Nigeria.
              </li>
              <li>
                Payment is processed securely through Paystack. We accept
                debit/credit cards, bank transfers, and USSD.
              </li>
              <li>
                Your order is confirmed only after payment is successfully
                processed.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Delivery
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We deliver across all 36 states in Nigeria and the FCT. Estimated
              delivery time is 3–7 business days from the date of dispatch. We
              are not responsible for delays caused by courier partners, extreme
              weather, or circumstances beyond our control. A tracking number
              will be provided once your order is dispatched.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Returns and Refunds
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our full returns and refunds process is described in our{" "}
              <Link
                href="/return-policy"
                className="text-orange-500 hover:text-orange-600"
              >
                Return Policy
              </Link>
              . By placing an order, you agree to the terms set out in that
              policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Account Responsibility
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You are responsible for maintaining the security of your account
              and password. You must notify us immediately of any unauthorised
              use of your account. We are not liable for any loss or damage
              arising from your failure to protect your account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All content on this website — including text, images, logos, and
              product descriptions — is the property of BlesseOgoVIk Fab and
              may not be reproduced, distributed, or used without our written
              permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Limitation of Liability
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To the maximum extent permitted by law, BlesseOgoVIk Fab shall
              not be liable for any indirect, incidental, or consequential
              damages arising from your use of our website or products. Our
              total liability shall not exceed the amount paid for the specific
              order giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Governing Law
            </h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms of Service are governed by the laws of the Federal
              Republic of Nigeria. Any disputes shall be resolved in the courts
              of Abia State, Nigeria.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Changes to These Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to update these terms at any time. Continued
              use of our website after changes are posted constitutes acceptance
              of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about these Terms, please contact us via our{" "}
              <Link
                href="/contact"
                className="text-orange-500 hover:text-orange-600"
              >
                contact page
              </Link>{" "}
              or email{" "}
              <a
                href="mailto:mwodovoctoria234@gmail.com"
                className="text-orange-500 hover:text-orange-600"
              >
                mwodovoctoria234@gmail.com
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
