"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import type { Product } from "@/lib/types/product";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  loading?: boolean;
  badge?: string;
}

export default function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref,
  loading = false,
  badge,
}: ProductSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <section className="max-w-[1400px] mx-auto px-3 sm:px-6 my-4 sm:my-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-2xs">
        {/* Section Header */}
        <div className="mb-3.5 sm:mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-base sm:text-xl font-bold tracking-tight text-slate-900">
                {title}
              </h2>
              {badge && (
                <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 font-medium hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Scroll Arrows */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={scrollLeft}
                aria-label="Scroll left"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-2xs transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={scrollRight}
                aria-label="Scroll right"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-2xs transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-2.5 sm:gap-3.5 overflow-x-auto pb-1.5 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[150px] sm:w-[210px]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <ProductCardSkeleton />
                </div>
              ))
            : products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex-shrink-0 w-[150px] sm:w-[210px]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}

          {!loading && products.length === 0 && (
            <div className="flex w-full items-center justify-center py-10 text-xs text-slate-500">
              No products found
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
