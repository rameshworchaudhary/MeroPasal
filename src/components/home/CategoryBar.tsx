"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Sparkles, Flame } from "lucide-react";
import type { Category } from "@/lib/types/category";

interface CategoryBarProps {
  categories?: Category[];
}

const CATEGORY_ITEMS = [
  { name: "For You", slug: "for-you", icon: "✨" },
  { name: "Mobiles", slug: "mobiles", icon: "📱" },
  { name: "Electronics", slug: "electronics", icon: "💻" },
  { name: "Fashion", slug: "fashion", icon: "👗" },
  { name: "Beauty", slug: "beauty", icon: "💄" },
  { name: "Home", slug: "home", icon: "🏠" },
  { name: "Appliances", slug: "appliances", icon: "⚡" },
  { name: "Kitchen", slug: "kitchen", icon: "🍳" },
  { name: "Sports", slug: "sports", icon: "⚽" },
  { name: "Furniture", slug: "furniture", icon: "🛋️" },
  { name: "Books", slug: "books", icon: "📚" },
  { name: "Grocery", slug: "grocery", icon: "🛒" },
  { name: "2 Wheelers", slug: "2-wheelers", icon: "🏍️" },
];

export default function CategoryBar({ categories = [] }: CategoryBarProps) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="border-b border-slate-200/80 bg-white py-2.5 shadow-2xs">
      <div className="container mx-auto px-2 sm:px-6 relative flex items-center">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="hidden md:flex absolute left-2 z-10 h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-blue-500 hover:text-blue-600 hover:scale-105"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Categories Horizontal Track */}
        <div
          ref={scrollRef}
          className="flex w-full items-center justify-start md:justify-between gap-4 md:gap-6 overflow-x-auto scrollbar-hide py-1 px-1 md:px-8"
        >
          {CATEGORY_ITEMS.map((cat, idx) => {
            const href = cat.slug === "for-you" ? "/" : `/categories/${cat.slug}`;
            const isActive = idx === 0 && pathname === "/" || pathname === href;

            return (
              <Link
                key={cat.slug}
                href={href}
                className={`group flex flex-col items-center shrink-0 min-w-[62px] sm:min-w-[72px] transition-all relative pb-1 ${
                  isActive ? "text-blue-600 font-bold" : "text-slate-700 font-medium hover:text-blue-600"
                }`}
              >
                <div
                  className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl text-lg sm:text-xl transition-all duration-200 group-hover:scale-105 ${
                    isActive
                      ? "bg-blue-50 text-blue-600 shadow-2xs border border-blue-200"
                      : "bg-slate-50 text-slate-700 group-hover:bg-blue-50/70"
                  }`}
                >
                  {cat.icon}
                </div>
                <span className="text-[11px] sm:text-xs mt-1.5 whitespace-nowrap tracking-tight">
                  {cat.name}
                </span>

                {/* Active Underline Pill Indicator */}
                {isActive && (
                  <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-blue-600 shadow-2xs" />
                )}
              </Link>
            );
          })}

          {/* More Link */}
          <Link
            href="/categories"
            className="group flex flex-col items-center shrink-0 min-w-[62px] sm:min-w-[72px] text-slate-700 hover:text-blue-600 transition-all"
          >
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 text-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
              •••
            </div>
            <span className="text-[11px] sm:text-xs mt-1.5 whitespace-nowrap font-semibold">
              More
            </span>
          </Link>
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="hidden md:flex absolute right-2 z-10 h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-blue-500 hover:text-blue-600 hover:scale-105"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
