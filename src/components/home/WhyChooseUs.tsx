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
    <section className="max-w-[1400px] mx-auto px-3 sm:px-6 my-6 sm:my-8">
      <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-8 shadow-2xs">
        <div className="mb-6 text-center max-w-xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-wider text-black mb-1">
            The NexShop Guarantee
          </p>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-black">
            Why Choose NexShop Nepal?
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
            Nepal&apos;s most trusted online shopping marketplace designed for speed & convenience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-3.5 p-4 rounded-xl border border-neutral-200 bg-neutral-50 hover:border-black hover:bg-white transition-all"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm text-black">{title}</p>
                <p className="mt-0.5 text-xs text-neutral-500 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
