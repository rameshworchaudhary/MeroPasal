import React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 bg-slate-200 rounded-lg" />
        <div className="h-4 w-72 bg-slate-100 rounded-md" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-white border border-slate-200/80 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-100 rounded" />
              <div className="h-9 w-9 rounded-lg bg-slate-100" />
            </div>
            <div className="h-7 w-32 bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      {/* Main content table / card skeleton */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="h-5 w-40 bg-slate-200 rounded" />
          <div className="h-9 w-28 bg-slate-100 rounded-lg" />
        </div>
        <div className="space-y-3 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-slate-100" />
                <div className="space-y-1.5">
                  <div className="h-4 w-48 bg-slate-200 rounded" />
                  <div className="h-3 w-28 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-6 w-20 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
