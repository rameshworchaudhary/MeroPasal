"use client";

import React from "react";

export default function NepalPaymentBar() {
  return (
    <section className="bg-slate-50 border-t border-slate-200/80 py-6">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
        <span className="text-xs font-semibold text-slate-600">
          We accept only
        </span>

        <div className="flex items-center gap-3">
          {/* eSewa Badge */}
          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 shadow-2xs">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white font-black text-[10px]">
              e
            </span>
            <span className="text-xs font-bold text-emerald-800">eSewa</span>
          </div>

          {/* Khalti Badge */}
          <div className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 shadow-2xs">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white font-black text-[10px]">
              K
            </span>
            <span className="text-xs font-bold text-purple-800">Khalti</span>
          </div>
        </div>
      </div>
    </section>
  );
}
