import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Shield,
  Truck,
  RotateCcw,
  Headphones,
  Store,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants/site";
import NexShopLogo from "@/components/common/NexShopLogo";

const footerLinks = {
  shopping: [
    { label: "All Products", href: "/products" },
    { label: "New Arrivals", href: "/products?sortBy=newest" },
    { label: "Best Sellers", href: "/products?sortBy=popular" },
    { label: "Flash Deals", href: "/products?featured=true" },
    { label: "All Categories", href: "/categories" },
  ],
  account: [
    { label: "My Profile", href: "/profile" },
    { label: "My Orders", href: "/orders" },
    { label: "Track Order", href: "/track-order" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Shopping Cart", href: "/cart" },
  ],
  seller: [
    { label: "Become a Seller", href: "/seller/apply" },
    { label: "Seller Dashboard", href: "/seller/dashboard" },
    { label: "Seller Policies", href: "/seller-policy" },
    { label: "Fulfillment by NexShop", href: "/fulfillment" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Return & Refund Policy", href: "/return-policy" },
    { label: "Shipping across 77 Districts", href: "/shipping-info" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

const trustBadges = [
  { icon: Truck, title: "77 District Delivery", desc: "Fast shipping to your doorstep" },
  { icon: RotateCcw, title: "7-Day Easy Return", desc: "Doorstep pickup & quick refund" },
  { icon: Shield, title: "100% Genuine Guarantee", desc: "Verified brand sellers & products" },
  { icon: Headphones, title: "24/7 Local Support", desc: "Dedicated Nepal support team" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-neutral-800 mt-16">
      {/* Trust Badges */}
      <div className="border-b border-neutral-800 bg-neutral-950">
        <div className="container mx-auto px-3.5 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustBadges.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3.5 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="h-10 w-10 rounded-lg bg-white text-black flex items-center justify-center shrink-0 font-bold">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs sm:text-sm">{title}</p>
                  <p className="text-[11px] sm:text-xs text-neutral-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-3.5 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="xs:col-span-2 lg:col-span-2 space-y-4">
            <div className="bg-white/5 p-2 rounded-xl inline-block border border-white/10">
              <NexShopLogo size="lg" />
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
              Nepal&apos;s world-class online marketplace connecting millions of shoppers with verified local sellers across all 77 districts.
            </p>

            <div className="space-y-2 text-xs sm:text-sm pt-1">
              <a
                href={`tel:${SITE_CONFIG.contact.phone}`}
                className="flex items-center gap-2.5 text-neutral-300 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-neutral-400" />
                {SITE_CONFIG.contact.phone}
              </a>
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="flex items-center gap-2.5 text-neutral-300 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 text-neutral-400" />
                {SITE_CONFIG.contact.email}
              </a>
              <div className="flex items-start gap-2.5 text-neutral-300">
                <MapPin className="h-4 w-4 text-neutral-400 mt-0.5 shrink-0" />
                <span>New Baneshwor, Kathmandu, Nepal</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-white hover:text-black transition-all"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-white hover:text-black transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-white hover:text-black transition-all"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shopping Links */}
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Shop NexShop</h3>
            <ul className="space-y-2.5">
              {footerLinks.shopping.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4">My Account</h3>
            <ul className="space-y-2.5">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Seller Corner */}
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Store className="h-4 w-4 text-white" /> Sell on NexShop
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.seller.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Customer Support</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Payment Options */}
            <div className="mt-6">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                We Accept Only
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 text-white text-xs font-bold px-3 py-1 rounded-lg">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-black font-black text-[9px]">
                    e
                  </span>
                  <span>eSewa</span>
                </div>
                <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 text-white text-xs font-bold px-3 py-1 rounded-lg">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-black font-black text-[9px]">
                    K
                  </span>
                  <span>Khalti</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-neutral-800 bg-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
            <p>© {new Date().getFullYear()} NexShop Technologies Pvt. Ltd. All rights reserved.</p>
            <p className="flex items-center gap-1 text-neutral-300 font-semibold">
              Crafted for Nepal 🇳🇵
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
