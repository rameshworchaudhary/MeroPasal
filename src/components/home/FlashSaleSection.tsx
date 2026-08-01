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
  // Realtime countdown timer state
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
    <section className="container mx-auto px-3.5 sm:px-6 py-8 sm:py-12">
      <div className="rounded-[24px] border border-blue-900/60 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-5 sm:p-8 shadow-2xl shadow-blue-950/30 text-white">
        {/* Header with Live Countdown */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20">
              <Zap className="h-7 w-7 fill-slate-950 text-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-300 border border-amber-400/30">
                  FLASH SALE
                </span>
                <span className="flex items-center gap-1 text-xs text-blue-300 font-semibold">
                  <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> Up to 60% OFF
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-black tracking-wide text-white mt-0.5">
                Today&apos;s Mega Flash Deals
              </h2>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 shadow-inner">
            <Clock className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-300 mr-1">Sale Ends In:</span>
            <div className="flex items-center gap-1 font-mono text-sm font-black text-white">
              <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs text-white shadow">{String(timeLeft.hours).padStart(2, "0")}h</span>
              <span className="text-amber-400">:</span>
              <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs text-white shadow">{String(timeLeft.minutes).padStart(2, "0")}m</span>
              <span className="text-amber-400">:</span>
              <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs text-white shadow">{String(timeLeft.seconds).padStart(2, "0")}s</span>
            </div>
          </div>
        </div>

        {/* Deals Carousel with Progress Indicators */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {products.slice(0, 8).map((product, index) => {
            const soldPercent = Math.min(85, 45 + (index * 8) % 40);
            const itemsLeft = Math.max(2, 12 - index);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-[170px] xs:w-[190px] sm:w-[235px] flex flex-col justify-between"
              >
                <ProductCard product={product} />

                {/* Stock progress bar */}
                <div className="mt-2.5 px-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 mb-1">
                    <span className="text-amber-300">🔥 {soldPercent}% Sold</span>
                    <span className="text-rose-400">{itemsLeft} left in stock</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-amber-400 transition-all duration-500"
                      style={{ width: `${soldPercent}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Link */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <p className="text-xs text-slate-400">🔥 Limited quantities available at promotional prices in Nepal</p>
          <Link
            href="/products?featured=true"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 hover:text-white transition-colors"
          >
            All Flash Deals <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
