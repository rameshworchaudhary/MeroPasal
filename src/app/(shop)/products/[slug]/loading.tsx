import React from "react";

export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-3.5 py-6 sm:px-6 sm:py-10 max-w-[1400px] animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-16 bg-slate-200 rounded" />
        <div className="h-4 w-4 bg-slate-200 rounded" />
        <div className="h-4 w-24 bg-slate-200 rounded" />
        <div className="h-4 w-4 bg-slate-200 rounded" />
        <div className="h-4 w-36 bg-slate-200 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Product Gallery Skeleton */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-2xl bg-slate-100 border border-slate-200/80" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-slate-100 border border-slate-200/80" />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-slate-200 rounded-full" />
            <div className="h-8 w-3/4 bg-slate-200 rounded-lg" />
            <div className="flex items-center gap-3">
              <div className="h-5 w-28 bg-slate-100 rounded" />
              <div className="h-5 w-20 bg-slate-100 rounded" />
            </div>
          </div>

          <div className="h-10 w-44 bg-slate-200 rounded-lg" />

          <div className="space-y-2 border-t border-b border-slate-100 py-4">
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-5/6 bg-slate-100 rounded" />
            <div className="h-4 w-2/3 bg-slate-100 rounded" />
          </div>

          <div className="flex gap-4 pt-2">
            <div className="h-12 flex-1 bg-slate-200 rounded-xl" />
            <div className="h-12 flex-1 bg-slate-900/10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
