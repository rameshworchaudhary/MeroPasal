"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Clock, Smartphone, Laptop, Tv, Headphones, Watch, Camera, Printer, BatteryCharging, Speaker, MoreHorizontal } from "lucide-react";
import type { Product } from "@/lib/types/product";
import type { Category } from "@/lib/types/category";
import { formatCurrency, calculateDiscount } from "@/lib/utils";

interface FlashAndCategoriesProps {
  products: Product[];
  categories: Category[];
}

const SPECIFIED_CATEGORY_GRID = [
  { name: "Mobiles", slug: "mobiles", icon: Smartphone },
  { name: "Laptops", slug: "electronics", icon: Laptop },
  { name: "TVs", slug: "electronics", icon: Tv },
  { name: "Headphones", slug: "electronics", icon: Headphones },
  { name: "Smartwatches", slug: "electronics", icon: Watch },
  { name: "Cameras", slug: "electronics", icon: Camera },
  { name: "Printers", slug: "electronics", icon: Printer },
  { name: "Power Banks", slug: "electronics", icon: BatteryCharging },
  { name: "Speakers", slug: "electronics", icon: Speaker },
  { name: "More", slug: "categories", icon: MoreHorizontal },
];

export default function FlashAndCategories({ products }: FlashAndCategoriesProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 32,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 45, seconds: 32 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.slice(0, 4);

  return (
    <section className="max-w-[1400px] mx-auto px-3 sm:px-6 my-3 sm:my-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Half: Flash Sale (6 cols on lg) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-base">
                  <Zap className="h-4.5 w-4.5 fill-amber-500 text-amber-500 animate-pulse" />
                  <span className="text-slate-900 font-serif text-base font-bold">Flash Sale</span>
                </div>

                {/* Countdown Timer */}
                <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
                  <Clock className="h-3 w-3" />
                  <span>{String(timeLeft.hours).padStart(2, "0")}</span>
                  <span>:</span>
                  <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
                  <span>:</span>
                  <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
                </div>
              </div>

              <Link
                href="/products?featured=true"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View All
              </Link>
            </div>

            {/* Flash Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {flashProducts.map((product, idx) => {
                const discount = product.comparePrice
                  ? calculateDiscount(product.comparePrice, product.price)
                  : 15;
                const itemsLeft = Math.max(12, 128 - idx * 24);

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-2 transition-all hover:border-blue-300 hover:bg-white hover:shadow-2xs"
                  >
                    <div>
                      {/* Thumbnail Image */}
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white mb-1.5">
                        <Image
                          src={product.thumbnailImage || "/images/flash/Flash1.jpg"}
                          alt={product.name}
                          fill
                          className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 45vw, 15vw"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Product Name */}
                      <h4 className="text-[11px] font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-600">
                        {product.name}
                      </h4>

                      {/* Price & Discount */}
                      <div className="mt-1 flex items-baseline gap-1 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">
                          {formatCurrency(product.price)}
                        </span>
                        {product.comparePrice && (
                          <span className="text-[9px] text-slate-400 line-through">
                            {formatCurrency(product.comparePrice)}
                          </span>
                        )}
                        <span className="text-[9px] font-extrabold text-emerald-600">
                          {discount}% OFF
                        </span>
                      </div>
                    </div>

                    {/* Stock Left Progress Bar */}
                    <div className="mt-2">
                      <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-rose-500"
                          style={{ width: `${Math.min(100, (itemsLeft / 150) * 100)}%` }}
                        />
                      </div>
                      <p className="text-[9px] font-semibold text-slate-500 mt-0.5">
                        Left: {itemsLeft} units
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Half: Shop by Category (6 cols on lg) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
              <h3 className="font-serif text-base font-bold text-slate-900">
                Shop by Category
              </h3>
              <Link
                href="/categories"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View All
              </Link>
            </div>

            {/* 10-Item Grid */}
            <div className="grid grid-cols-2 xs:grid-cols-5 gap-2">
              {SPECIFIED_CATEGORY_GRID.map((item) => {
                const IconComponent = item.icon;
                const href = item.slug === "categories" ? "/categories" : `/categories/${item.slug}`;

                return (
                  <Link
                    key={item.name}
                    href={href}
                    className="group flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 transition-all hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-2xs text-center"
                  >
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-2xs mb-1.5 group-hover:scale-105 transition-transform border border-slate-100">
                      <IconComponent className="h-4.5 w-4.5 text-blue-600 group-hover:text-blue-700" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 group-hover:text-blue-600 line-clamp-1">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
