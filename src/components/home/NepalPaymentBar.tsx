"use client";

import React from "react";

export default function NepalPaymentBar() {
  return (
    <section className="bg-white border-t border-b border-neutral-200 py-5 my-4">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          We accept only
        </span>

        <div className="flex items-center gap-3">
          {/* eSewa Badge */}
          <div className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-neutral-100 px-3.5 py-1.5 shadow-2xs">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white font-black text-[10px]">
              e
            </span>
            <span className="text-xs font-extrabold text-black">eSewa</span>
          </div>

          {/* Khalti Badge */}
          <div className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-neutral-100 px-3.5 py-1.5 shadow-2xs">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white font-black text-[10px]">
              K
            </span>
            <span className="text-xs font-extrabold text-black">Khalti</span>
          </div>
        </div>
      </div>
    </section>
  );
}
