import React from "react";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";

export default function CategoryDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-12 bg-slate-200 rounded" />
        <div className="h-4 w-3 bg-slate-200 rounded" />
        <div className="h-4 w-20 bg-slate-200 rounded" />
        <div className="h-4 w-3 bg-slate-200 rounded" />
        <div className="h-4 w-28 bg-slate-200 rounded" />
      </div>

      {/* Category header */}
      <div className="mb-6 space-y-2">
        <div className="h-8 w-56 bg-slate-200 rounded-lg" />
        <div className="h-4 w-80 bg-slate-100 rounded" />
        <div className="h-4 w-32 bg-slate-100 rounded" />
      </div>

      {/* Subcategory pills skeleton */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-slate-100 rounded-full border border-slate-200" />
        ))}
      </div>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="h-96 rounded-xl border p-5 bg-card space-y-4">
            <div className="h-5 w-24 bg-slate-200 rounded" />
            <div className="h-4 w-full bg-slate-100 rounded" />
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
