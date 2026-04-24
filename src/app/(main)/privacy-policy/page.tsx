import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — BlessedOgoVik Fab",
};

export default function PrivacyPolicyPage() {
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

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: April 2026</p>

        <div className="space-y-8">

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              BlessedOgoVik Fab (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
              &ldquo;our&rdquo;) is committed to protecting your personal
              information. This Privacy Policy explains what data we collect,
              how we use it, and your rights regarding your information when you
              use our website at blesseogovik.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Information We Collect
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We collect the following types of information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>
                <strong>Account information:</strong> Name, email address,
                and profile details when you create an account via Clerk.
              </li>
              <li>
                <strong>Order information:</strong> Delivery address, phone
                number, and purchase history when you place an order.
              </li>
              <li>
                <strong>Payment information:</strong> Payment is processed
                securely by Paystack. We do not store your card details.
              </li>
              <li>
                <strong>Usage data:</strong> Pages visited, browser type, and
                device information for analytics purposes.
              </li>
              <li>
                <strong>Communications:</strong> Messages you send via our
                contact form.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>To process and fulfill your orders.</li>
              <li>To communicate with you about your orders and enquiries.</li>
              <li>To improve our website and services.</li>
              <li>To comply with legal obligations.</li>
              <li>To prevent fraud and ensure the security of our platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              How We Share Your Information
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell your personal data. We may share your information
              with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mt-3">
              <li>
                <strong>Paystack</strong> — for secure payment processing.
              </li>
              <li>
                <strong>Clerk</strong> — for user authentication and account
                management.
              </li>
              <li>
                <strong>Courier partners</strong> — your delivery address and
                phone number to fulfil your order.
              </li>
              <li>
                <strong>Legal authorities</strong> — if required by law.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Data Retention
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal data for as long as necessary to fulfil
              the purposes outlined in this policy, or as required by law. Order
              records are retained for a minimum of 5 years for accounting
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Your Rights
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and data.</li>
              <li>Withdraw consent where processing is based on consent.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              To exercise any of these rights, please contact us at{" "}
              <a
                href="mailto:mwodovoctoria234@gmail.com"
                className="text-orange-500 hover:text-orange-600"
              >
                mwodovoctoria234@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Cookies
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our website uses essential cookies for authentication and session
              management. We do not currently use advertising or tracking
              cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Changes to This Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated date. We encourage you to
              review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please
              contact us via our{" "}
              <Link href="/contact" className="text-orange-500 hover:text-orange-600">
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
