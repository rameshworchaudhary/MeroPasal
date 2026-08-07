"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Award } from "lucide-react";

const BRANDS = [
  {
    name: "Samsung",
    slug: "Samsung",
    logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80",
    itemCount: "120+ Products",
  },
  {
    name: "Apple",
    slug: "Apple",
    logo: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=80",
    itemCount: "80+ Products",
  },
  {
    name: "Nike",
    slug: "Nike",
    logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    itemCount: "150+ Products",
  },
  {
    name: "Sony",
    slug: "Sony",
    logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    itemCount: "95+ Products",
  },
  {
    name: "Adidas",
    slug: "Adidas",
    logo: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=400&q=80",
    itemCount: "110+ Products",
  },
  {
    name: "Xiaomi",
    slug: "Xiaomi",
    logo: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80",
    itemCount: "140+ Products",
  },
];

export default function PopularBrands() {
  return (
    <section className="max-w-[1400px] mx-auto px-3 sm:px-6 my-4 sm:my-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-2xs">
        <div className="mb-4 flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Award className="h-4 w-4 text-black" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-black">
                Verified Partners
              </p>
            </div>
            <h2 className="font-serif text-base sm:text-xl font-bold text-black">
              Popular Brands in Nepal
            </h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-xs font-bold text-black hover:underline transition-colors"
          >
            All Brands <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3.5">
          {BRANDS.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Link
                href={`/products?brand=${encodeURIComponent(brand.slug)}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 p-2 sm:p-3 text-center transition-all duration-200 hover:border-black hover:bg-white"
              >
                <div className="relative h-20 sm:h-28 w-full overflow-hidden rounded-lg bg-neutral-100 mb-2">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 33vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>
                <p className="text-xs font-bold text-black group-hover:underline line-clamp-1">
                  {brand.name}
                </p>
                <p className="text-[10px] font-medium text-neutral-500">{brand.itemCount}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
