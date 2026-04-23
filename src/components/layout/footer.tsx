import Link from "next/link";
import { Scissors, MapPin, Phone, Mail, Globe, MessageCircle, Share2 } from "lucide-react";
import { getFooterCategories } from "@/lib/data/footer-categories";

const accountLinks = [
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Create Account" },
  { href: "/orders", label: "My Orders" },
  { href: "/account", label: "Account Settings" },
];

export default async function Footer() {
  const shopCategories = await getFooterCategories();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
                <Scissors className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BlesseOgoVIk Fab</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Your trusted source for premium luxury beaded lace — delivered
              across Nigeria.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 rounded-full bg-gray-800 hover:bg-orange-500 transition-colors"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-gray-800 hover:bg-orange-500 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-gray-800 hover:bg-orange-500 transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-white mb-4">Shop by Category</h3>
            <ul className="space-y-2">
              {shopCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="text-sm hover:text-orange-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-white mb-4">My Account</h3>
            <ul className="space-y-2">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 text-orange-400 mt-0.5 shrink-0" />
                <span>MAB 30 Main line Shopping Center Aba</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-orange-400 shrink-0" />
                <a href="tel:+2348037340545" className="hover:text-orange-400">
                  08037340545
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-orange-400 shrink-0" />
                <a
                  href="mailto:mwodovoctoria234@gmail.com"
                  className="hover:text-orange-400"
                >
                  mwodovoctoria234@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-4 text-xs text-gray-500">
              <p>Mon – Sat: 8:00 AM – 7:00 PM</p>
              <p>Sunday: 10:00 AM – 4:00 PM</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} BlesseOgoVIk Fab. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/contact" className="hover:text-orange-400">
              Contact Us
            </Link>
            <Link href="/privacy-policy" className="hover:text-orange-400">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-orange-400">
              Terms of Service
            </Link>
            <Link href="/return-policy" className="hover:text-orange-400">
              Return Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
