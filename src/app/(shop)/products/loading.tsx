import React from "react";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-3.5 py-6 sm:px-6 sm:py-10 lg:py-14 animate-pulse">
      <div className="mb-6 sm:mb-8 border-b border-[#e5ded3] pb-5 sm:pb-7">
        <div className="h-3 w-28 bg-slate-200 rounded mb-2" />
        <div className="h-8 w-64 bg-slate-200 rounded-lg mb-2" />
        <div className="h-4 w-36 bg-slate-100 rounded" />
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <div className="h-96 rounded-xl border border-[#ded6ca] bg-[#f8f5ef] p-5 space-y-4">
            <div className="h-5 w-28 bg-slate-200 rounded" />
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-3/4 bg-slate-200 rounded" />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
