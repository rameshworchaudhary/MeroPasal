import React from "react";
import { Tag, ShieldCheck, RefreshCw, Lock, Truck, Banknote } from "lucide-react";

export default function FeatureStrip() {
  const features = [
    {
      icon: Tag,
      title: "Best Prices",
      subtitle: "Unbeatable deals",
    },
    {
      icon: ShieldCheck,
      title: "Genuine Products",
      subtitle: "100% Original",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      subtitle: "7 days policy",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      subtitle: "100% Safe",
    },
    {
      icon: Truck,
      title: "77 District Delivery",
      subtitle: "Fast shipping",
    },
    {
      icon: Banknote,
      title: "Digital Wallets",
      subtitle: "eSewa & Khalti",
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 my-2 sm:my-3">
      <div className="rounded-xl border border-neutral-200 bg-white p-3.5 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-center gap-3 ${
                  idx !== 0 ? "pt-2 sm:pt-0 sm:pl-3" : ""
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-black leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-neutral-500 font-medium leading-none mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
