"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Tag, ArrowRight, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Banner } from "@/lib/types/banner";

interface HeroBannerProps {
  banners: Banner[];
}

const FALLBACK_BANNERS = [
  {
    id: "dashain",
    title: "Maha Dashain Mega Dhamaka",
    subtitle: "Celebrate Nepal's biggest festival with up to 70% OFF + Flat Rs. 1,000 Vouchers",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=85",
    buttonText: "Shop Dashain Deals",
    linkValue: "/products?featured=true",
    badge: "DASHAIN SALE 2083",
  },
  {
    id: "electronics",
    title: "Nepal Electronics & Tech Expo",
    subtitle: "Unbeatable deals on 5G Smartphones, Laptops, Smart TVs & more",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85",
    buttonText: "Shop Now",
    linkValue: "/categories/electronics",
    badge: "TECH FESTIVAL",
  },
  {
    id: "tihar",
    title: "Tihar Lights & Celebration Sale",
    subtitle: "Illuminate your home! Discounts on Decorative LED Lights, Dry Fruits & Appliances",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85",
    buttonText: "Explore Tihar Specials",
    linkValue: "/categories/home",
    badge: "TIHAR FESTIVAL OFFER",
  },
  {
    id: "fashion",
    title: "Fashion Carnival & Trends",
    subtitle: "Authentic Kurti Sets, Dhaka Topi, Sneakers and Premium Western Wear",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",
    buttonText: "Explore Fashion",
    linkValue: "/categories/fashion",
    badge: "FASHION CARNIVAL",
  },
];

export default function HeroBanner({ banners }: HeroBannerProps) {
  const slides = banners.length > 0 ? banners : FALLBACK_BANNERS;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next, isPaused, slides.length]);

  const currentSlide = slides[current];
  const bgImage =
    (currentSlide as Banner).image ||
    (currentSlide as (typeof FALLBACK_BANNERS)[0]).image;

  const badgeText =
    (currentSlide as (typeof FALLBACK_BANNERS)[0]).badge || "DASHAIN SALE 2083";

  return (
    <section className="max-w-[1400px] mx-auto px-3 sm:px-6 my-2 sm:my-3">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        {/* Main Hero Banner Slider (Left ~75% width on Desktop, COMPACT HEIGHT: 210px mobile, 350px desktop) */}
        <div
          className="lg:col-span-9 relative overflow-hidden rounded-2xl bg-slate-950 h-[210px] sm:h-[280px] lg:h-[350px] flex items-center shadow-xs group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 flex items-center"
            >
              {/* Banner Background */}
              <Image
                src={bgImage}
                alt={(currentSlide as Banner).title || "Kinbey Banner"}
                fill
                className="object-cover object-center transition-transform duration-[6000ms] scale-102"
                priority={current === 0}
                sizes="(max-width: 1024px) 100vw, 75vw"
                referrerPolicy="no-referrer"
              />

              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />

              {/* Slide Content */}
              <div className="relative z-10 p-4 sm:p-7 max-w-[88%] sm:max-w-lg text-white">
                <div className="inline-flex items-center gap-1.5 rounded-md border border-amber-400/40 bg-amber-400/15 px-2.5 py-0.5 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-300 backdrop-blur-md mb-2">
                  <Tag className="h-3 w-3 text-amber-400" />
                  <span>{badgeText}</span>
                </div>

                <h1 className="text-base sm:text-2xl lg:text-3xl font-extrabold tracking-tight font-serif leading-tight text-white drop-shadow-xs">
                  {(currentSlide as Banner).title}
                </h1>

                {(currentSlide as Banner).subtitle && (
                  <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-slate-300 line-clamp-2 max-w-md">
                    {(currentSlide as Banner).subtitle}
                  </p>
                )}

                <div className="mt-3 sm:mt-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    className="rounded-xl bg-white text-slate-900 hover:bg-slate-100 px-4 py-1.5 h-8 text-xs font-bold shadow-xs transition-all hover:scale-102"
                    asChild
                  >
                    <Link href={(currentSlide as (typeof FALLBACK_BANNERS)[0]).linkValue || "/products"}>
                      {(currentSlide as Banner).buttonText || "Shop Now"} <ArrowRight className="ml-1 h-3.5 w-3.5 text-slate-900" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Left Arrow - Hidden on mobile to prevent overlapping text */}
          {slides.length > 1 && (
            <button
              onClick={prev}
              aria-label="Previous banner"
              className="hidden sm:flex absolute left-2.5 top-1/2 z-20 h-7 w-7 sm:h-8 sm:w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700/80 bg-slate-950/70 text-white backdrop-blur-xs transition-all hover:bg-blue-600 hover:scale-110 opacity-75 group-hover:opacity-100 shadow-xs"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {/* Slider Right Arrow - Hidden on mobile to prevent overlapping text */}
          {slides.length > 1 && (
            <button
              onClick={next}
              aria-label="Next banner"
              className="hidden sm:flex absolute right-2.5 top-1/2 z-20 h-7 w-7 sm:h-8 sm:w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700/80 bg-slate-950/70 text-white backdrop-blur-xs transition-all hover:bg-blue-600 hover:scale-110 opacity-75 group-hover:opacity-100 shadow-xs"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {/* Pagination Indicators */}
          {slides.length > 1 && (
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === current ? "w-5 bg-blue-500" : "w-1.5 bg-white/40 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Side Offer Card (Right ~25% width on Desktop, matching height 350px on desktop) */}
        <div className="lg:col-span-3 h-[140px] sm:h-[160px] lg:h-[350px]">
          <div className="h-full rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50/70 via-slate-50 to-emerald-50/50 p-4 shadow-2xs relative overflow-hidden flex flex-row lg:flex-col justify-between items-center lg:items-start transition-all hover:border-blue-300">
            <div className="flex-1 pr-2 lg:pr-0">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-700 bg-blue-100/90 px-2 py-0.5 rounded-md">
                Exchange Offer
              </span>

              <h3 className="text-sm sm:text-base lg:text-lg font-extrabold text-slate-900 leading-tight mt-2">
                Up to Rs. 15,000 Off
              </h3>

              <p className="text-[11px] text-slate-600 mt-0.5 font-medium line-clamp-1 lg:line-clamp-2">
                On your old smartphone or electronic device
              </p>

              <div className="mt-2 sm:mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 rounded-xl border-slate-300 bg-white hover:bg-blue-50 text-slate-800 text-[11px] font-bold shadow-2xs hover:text-blue-600 px-3"
                  asChild
                >
                  <Link href="/categories/mobiles">
                    Explore Now <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Smartphone Exchange Graphic */}
            <div className="shrink-0 flex justify-end lg:w-full lg:mt-3">
              <div className="relative h-14 w-14 lg:h-20 lg:w-20 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs rotate-2">
                <Smartphone className="h-7 w-7 lg:h-10 lg:w-10 text-emerald-300" />
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 text-[8px] lg:text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-2xs">
                  SWAP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
