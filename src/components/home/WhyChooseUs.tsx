"use client";

import React from "react";
import { Truck, ShieldCheck, Banknote, RotateCcw, Headphones, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Nationwide Express Delivery",
    desc: "Fast delivery to all 77 districts across Nepal within 24-48 hours",
  },
  {
    icon: Banknote,
    title: "Cash on Delivery Available",
    desc: "Pay safely at your doorstep with Cash, eSewa, or Khalti",
  },
  {
    icon: ShieldCheck,
    title: "100% Authentic Products",
    desc: "Sourced directly from verified brands and authorized sellers",
  },
  {
    icon: RotateCcw,
    title: "Easy 7-Day Returns",
    desc: "Hassle-free replacement or refund policy on all purchases",
  },
  {
    icon: Headphones,
    title: "24/7 Local Support",
    desc: "Dedicated Nepali customer care team always ready to assist",
  },
  {
    icon: Sparkles,
    title: "Best Price Guarantee",
    desc: "Unbeatable deals and daily discounts on top quality goods",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="container mx-auto px-3.5 sm:px-6 py-8 sm:py-12 border-t border-slate-200/80">
      <div className="mb-6 sm:mb-8 text-center max-w-xl mx-auto">
        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">
          The Kinbey Guarantee
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
          Why Choose Kinbey Nepal?
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
          Nepal&apos;s most trusted online shopping marketplace designed for speed & convenience
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs hover:border-blue-300 transition-all"
          >
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-slate-900">{title}</p>
              <p className="mt-0.5 text-xs text-slate-500 leading-snug">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
