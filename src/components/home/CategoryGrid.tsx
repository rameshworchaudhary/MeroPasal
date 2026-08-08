"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types/category";

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  electronics: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
  fashion: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80",
  grocery: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
  home: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80",
  beauty: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80",
  sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80",
  books: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80",
  toys: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500&q=80",
  automotive: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80",
  furniture: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80",
  jewellery: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80",
};

function getCategoryFallbackImage(slug: string): string {
  for (const [key, img] of Object.entries(CATEGORY_FALLBACK_IMAGES)) {
    if (slug.toLowerCase().includes(key)) return img;
  }
  return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80";
}

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  const displayed = categories.slice(0, 10);

  return (
    <section className="container mx-auto border-t border-[#e5ded3] px-3.5 sm:px-6 py-8 sm:py-12 lg:py-16">
      {/* Section header */}
      <div className="mb-6 sm:mb-8 flex flex-col xs:flex-row items-start xs:items-end justify-between gap-3">
        <div>
          <p className="mb-1 sm:mb-2 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b6b35]">
            Discover your next favorite
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-wide text-[#292722]">Shop by Category</h2>
          <p className="mt-1 text-xs sm:text-sm text-[#777166]">
            Explore our wide range of product categories
          </p>
        </div>
        <Link
          href="/categories"
          className="flex shrink-0 items-center gap-1.5 border-b border-[#b99558] pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f542b] transition-colors hover:text-[#292722]"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-2.5 sm:gap-3.5">
        {displayed.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/categories/${category.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-[#e1d9cd] bg-[#fcfaf6] p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#b99558] hover:shadow-[0_12px_28px_rgba(54,48,39,0.08)] sm:p-4"
            >
              {/* Category image */}
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-[#f0ebe2] transition-transform duration-300 group-hover:scale-[1.03]">
                <Image
                  src={category.image || getCategoryFallbackImage(category.slug)}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 42vw, 12vw"
                />
              </div>

              <p className="line-clamp-2 text-center text-xs font-semibold leading-tight text-[#514c43] transition-colors group-hover:text-[#8b6b35]">
                {category.name}
              </p>

              {category.productCount > 0 && (
                <span className="text-[10px] uppercase tracking-[0.08em] text-[#9a9388]">
                  {category.productCount} pieces
                </span>
              )}
            </Link>
          </motion.div>
        ))}

        {/* "All categories" tile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: displayed.length * 0.05 }}
        >
          <Link
            href="/categories"
            className="group flex flex-col items-center gap-3 rounded-xl border border-[#b99558] bg-[#292722] p-3.5 transition-all duration-300 hover:-translate-y-1 hover:bg-[#403b32] hover:shadow-[0_12px_28px_rgba(54,48,39,0.15)] sm:p-4"
          >
            <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-[#c6a56a]/40 bg-[#b99558]/15 transition-colors group-hover:bg-[#b99558]/25">
              <span className="text-2xl text-[#e0c28a]">+</span>
            </div>
            <p className="text-center text-xs font-semibold leading-tight text-[#e0c28a] transition-colors group-hover:text-white">
              All Categories
            </p>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
