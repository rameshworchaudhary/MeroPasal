"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Clock, ArrowRight, Flame } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/types/product";

interface FlashSaleSectionProps {
  products: Product[];
}

export default function FlashSaleSection({ products }: FlashSaleSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 25,
    seconds: 40,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-3 sm:px-6 my-4 sm:my-6">
      <div className="rounded-xl border border-neutral-900 bg-black p-4 sm:p-6 text-white shadow-sm">
        {/* Header with Live Countdown */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black shrink-0">
              <Zap className="h-5 w-5 fill-black text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-white/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white border border-white/30">
                  FLASH SALE
                </span>
                <span className="flex items-center gap-1 text-xs text-neutral-300 font-semibold">
                  <Flame className="h-3.5 w-3.5 fill-white text-white" /> Up to 60% OFF
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                Today&apos;s Mega Flash Deals
              </h2>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2.5 bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2">
            <Clock className="h-4 w-4 text-white shrink-0" />
            <span className="text-xs font-semibold text-neutral-300 mr-1">Ends In:</span>
            <div className="flex items-center gap-1 font-mono text-xs font-bold text-white">
              <span className="rounded bg-white px-2 py-1 text-black">{String(timeLeft.hours).padStart(2, "0")}h</span>
              <span className="text-white">:</span>
              <span className="rounded bg-white px-2 py-1 text-black">{String(timeLeft.minutes).padStart(2, "0")}m</span>
              <span className="text-white">:</span>
              <span className="rounded bg-white px-2 py-1 text-black">{String(timeLeft.seconds).padStart(2, "0")}s</span>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {products.slice(0, 10).map((product, index) => {
            const soldPercent = Math.min(88, 45 + (index * 8) % 40);
            const itemsLeft = Math.max(2, 14 - index);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.3) }}
                className="flex flex-col justify-between"
              >
                <ProductCard product={product} />

                {/* Stock progress bar */}
                <div className="mt-2 px-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-neutral-300 mb-1">
                    <span>🔥 {soldPercent}% Sold</span>
                    <span className="text-neutral-400">{itemsLeft} left</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-500"
                      style={{ width: `${soldPercent}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Link */}
        <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-between">
          <p className="text-xs text-neutral-400">Limited promotional stock available in Nepal</p>
          <Link
            href="/products?featured=true"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:underline transition-colors"
          >
            All Flash Deals <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
