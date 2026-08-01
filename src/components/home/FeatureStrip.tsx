"use client";

import React from "react";
import { Tag, ShieldCheck, RefreshCw, Lock, Truck, Banknote } from "lucide-react";

export default function FeatureStrip() {
  const features = [
    {
      icon: Tag,
      title: "Best Prices",
      subtitle: "Unbeatable deals",
      color: "text-amber-500 bg-amber-50",
    },
    {
      icon: ShieldCheck,
      title: "Genuine Products",
      subtitle: "100% Original",
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      subtitle: "7 days return policy",
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      subtitle: "100% Safe Payments",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      subtitle: "Quick & reliable",
      color: "text-purple-600 bg-purple-50",
    },
    {
      icon: Banknote,
      title: "Digital Wallets",
      subtitle: "eSewa & Khalti",
      color: "text-teal-600 bg-teal-50",
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 my-2.5 sm:my-3">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-3.5 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-center gap-2.5 ${
                  idx !== 0 ? "pt-2 sm:pt-0 sm:pl-2.5 lg:pl-3" : ""
                }`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
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
