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
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 mt-16">
      {/* Trust Badges */}
      <div className="border-b border-slate-800/80 bg-slate-900/40">
        <div className="container mx-auto px-3.5 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustBadges.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-md">
                <div className="h-11 w-11 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs sm:text-sm">{title}</p>
                  <p className="text-[11px] sm:text-xs text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-3.5 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="xs:col-span-2 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 text-white font-black text-xl tracking-tighter">
                N
              </div>
              <div>
                <p className="font-extrabold text-white text-2xl leading-none tracking-tight">NexShop</p>
                <p className="text-[11px] text-blue-400 font-semibold mt-0.5">Sabai kura, ekai thau ma 🇳🇵</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Nepal&apos;s world-class online marketplace connecting millions of shoppers with verified local sellers across all 77 districts.
            </p>

            <div className="space-y-2.5 text-xs sm:text-sm pt-1">
              <a
                href={`tel:${SITE_CONFIG.contact.phone}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-blue-400 transition-colors"
              >
                <Phone className="h-4 w-4 text-blue-400" />
                {SITE_CONFIG.contact.phone}
              </a>
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-blue-400 transition-colors"
              >
                <Mail className="h-4 w-4 text-blue-400" />
                {SITE_CONFIG.contact.email}
              </a>
              <div className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>New Baneshwor, Kathmandu, Nepal</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shopping Links */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Shop NexShop</h3>
            <ul className="space-y-2.5">
              {footerLinks.shopping.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">My Account</h3>
            <ul className="space-y-2.5">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Seller Corner */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Store className="h-4 w-4 text-emerald-400" /> Sell on NexShop
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.seller.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Customer Support</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Payment options */}
            <div className="mt-6">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                We Accept Only
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-[#60BB46]/15 border border-[#60BB46]/40 text-emerald-400 text-xs font-bold px-3 py-1 rounded-lg">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#60BB46] text-white font-black text-[9px]">
                    e
                  </span>
                  <span>eSewa</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#5C2D91]/20 border border-[#5C2D91]/40 text-purple-300 text-xs font-bold px-3 py-1 rounded-lg">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#5C2D91] text-white font-black text-[9px]">
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
      <div className="border-t border-slate-800/80 bg-slate-950">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} NexShop Technologies Pvt. Ltd. All rights reserved.</p>
            <p className="flex items-center gap-1 text-slate-300 font-semibold">
              Crafted for Nepal 🇳🇵
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-slate-300 transition-colors">
                Terms
              </Link>
              <Link href="/sitemap" className="hover:text-slate-300 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
