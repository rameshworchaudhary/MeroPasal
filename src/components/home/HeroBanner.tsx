"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Banner } from "@/lib/types/banner";

interface HeroBannerProps {
  banners: Banner[];
}

const FALLBACK_BANNERS = [
  {
    id: "adivasi-hair-oil",
    title: " ",
    subtitle:
      " ",
    image: "/images/hero/Adivasi.jpg",
    buttonText: "Shop Now & Save",
    linkValue: "/products?featured=true",
    badge: "",
  },
  {
    id: "japanese-soothing-massage-gel",
    title: " ",
    subtitle:
      " ",
    image: "/images/hero/japan.jpg",
    buttonText: "Shop Now & Save",
    linkValue: "/products?featured=true",
    badge: "",
  },
   {
    id: "paras-product",
    title: " ",
    subtitle:
      " ",
    image: "/images/hero/paras.jpg",
    buttonText: "Shop Now & Save",
    linkValue: "/products?featured=true",
    badge: "",
  },
   {
    id: "Ayurveda-product",
    title: " ",
    subtitle:
      " ",
    image: "/images/hero/ayurveda.jpg",
    buttonText: "Shop Now & Save",
    linkValue: "/products?featured=true",
    badge: "",
  },
  {
    id: "dashain",
    title: "Maha Dashain Mega Dhamaka",
    subtitle:
      " ",
    image: "/images/hero/dashain.png",
    buttonText: "Shop Dashain Deals",
    linkValue: "/products?featured=true",
    badge: "DASHAIN SALE 2083",
  },
  {
    id: "electronics",
    title: "Nepal Electronics & Tech Expo",
    subtitle:
      " ",
    image:
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1600&q=80",
    buttonText: "Shop Tech",
    linkValue: "/categories/electronics",
    badge: "TECH EXPO",
  },
  {
    id: "tihar",
    title: "Tihar Lights & Celebration Sale",
    subtitle:
      " ",
    image: "/images/hero/Tihar.jpg",
    buttonText: "Explore Tihar Specials",
    linkValue: "/categories/home",
    badge: "TIHAR SPECIAL",
  },
  {
    id: "fashion",
    title: "Fashion Carnival & Trends",
    subtitle:
      " ",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
    buttonText: "Explore Fashion",
    linkValue: "/categories/fashion",
    badge: "FASHION CARNIVAL",
  },
];

const DEFAULT_HERO_BACKUP =
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=80";

function resolveBannerHref(slide: Banner | (typeof FALLBACK_BANNERS)[0]): string {
  if (!("linkType" in slide)) {
    return slide.linkValue || "/products";
  }

  const { linkType, linkValue } = slide as Banner;
  if (!linkValue) return "/products";

  switch (linkType) {
    case "category":
      return `/categories/${linkValue}`;
    case "product":
      return `/products/${linkValue}`;
    case "url":
      return linkValue;
    case "none":
    default:
      return "/products";
  }
}

export default function HeroBanner({ banners }: HeroBannerProps) {
  const slides = banners.length > 0 ? banners : FALLBACK_BANNERS;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [sportsImgFailed, setSportsImgFailed] = useState(false);

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

  const currentSlide = slides[current] || slides[0];
  const rawImage =
    (currentSlide as Banner).image ||
    (currentSlide as (typeof FALLBACK_BANNERS)[0]).image ||
    DEFAULT_HERO_BACKUP;

  const slideId = currentSlide.id || `slide-${current}`;
  const isImageFailed = failedImages[slideId];
  const bgImage = isImageFailed ? DEFAULT_HERO_BACKUP : rawImage;

  // Determine if image should bypass Next optimization for instant blob/data preview
  const isDirectImage =
    bgImage.startsWith("data:") ||
    bgImage.startsWith("blob:") ||
    isImageFailed;

  const badgeText =
    (currentSlide as (typeof FALLBACK_BANNERS)[0]).badge || "SPECIAL OFFER";

  return (
    <section className="max-w-[1400px] mx-auto px-3 sm:px-6 my-3 sm:my-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        {/* Main Hero Banner Slider - 3D Stage matching IMAGE 2 */}
        <div
          className="lg:col-span-9 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#d5e4f5] via-[#e9f1f9] to-[#c5d7e8] h-[280px] sm:h-[340px] lg:h-[390px] flex items-center shadow-md border border-slate-300/80 group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Stage Background Glow & Pedestal Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-cyan-500/5 to-transparent" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center p-4 sm:p-8"
            >
              {/* Grid content: Left Details + Right Floating 3D Product Stage */}
              <div className="relative z-10 w-full h-full grid grid-cols-12 items-center">
                {/* Left Text / Medal Details */}
                <div className="col-span-7 sm:col-span-7 lg:col-span-6 flex flex-col justify-center space-y-2 sm:space-y-3 pr-2 text-white">
                  {/* 3D Gold/Blue Medal Badge matching IMAGE 2 */}
                  <div className="inline-flex items-center gap-2 self-start rounded-2xl bg-gradient-to-r from-blue-900/80 via-indigo-900/80 to-slate-900/90 border border-amber-400/40 p-2 shadow-lg shadow-amber-500/10 backdrop-blur-md">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-inner shrink-0">
                      🏆
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-cyan-300">
                        Mega Savings
                      </span>
                      <span className="text-xs sm:text-sm font-black text-amber-300 leading-tight">
                        FLAT 50% Off
                      </span>
                    </div>
                  </div>

                  {/* Special Offer Pill Badge */}
                  <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
                    <Tag className="h-3 w-3 text-emerald-400" />
                    <span>{badgeText}</span>
                  </div>

                  {/* Product Title */}
                  <h1 className="text-base sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight text-slate-900 line-clamp-2">
                    {(currentSlide as Banner).title && ((currentSlide as Banner).title?.trim()?.length ?? 0) > 0
                      ? (currentSlide as Banner).title
                      : "Adivasi Vishvambhari..."}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-[11px] sm:text-xs font-semibold leading-relaxed text-slate-600 line-clamp-2">
                    {(currentSlide as Banner).subtitle && ((currentSlide as Banner).subtitle?.trim()?.length ?? 0) > 0
                      ? (currentSlide as Banner).subtitle
                      : "Save big on authentic recipes"}
                  </p>

                  {/* Glowing CTA Button */}
                  <div className="pt-1">
                    <Button
                      size="sm"
                      className="rounded-full bg-white text-[#0d5c58] border border-cyan-400/40 hover:bg-cyan-50 font-black px-5 py-2.5 h-9 sm:h-10 text-xs tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                      asChild
                    >
                      <Link href={resolveBannerHref(currentSlide)}>
                        <span>SHOP NOW</span>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-xs shadow-xs">
                          →
                        </span>
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Right Media Area: Floating Product on 3D Pedestal Stage */}
                <div className="col-span-5 sm:col-span-5 lg:col-span-6 relative h-full flex items-center justify-center">
                  {/* 3D Cylinder Pedestal Graphic */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 sm:w-48 lg:w-64 h-8 sm:h-12 rounded-[100%] bg-gradient-to-b from-slate-700/80 to-slate-900/90 border border-slate-600/50 shadow-2xl shadow-cyan-500/10 backdrop-blur-md" />

                  {/* Floating Product Image */}
                  <div className="relative h-44 sm:h-56 lg:h-72 w-full max-w-[220px] sm:max-w-[280px] drop-shadow-2xl transition-transform duration-500 hover:scale-105 z-10">
                    <Image
                      src={bgImage}
                      alt={(currentSlide as Banner).title || "NexShop Banner"}
                      fill
                      className="object-contain object-bottom filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                      priority={current === 0}
                      unoptimized={isDirectImage}
                      onError={() => {
                        setFailedImages((prev) => ({ ...prev, [slideId]: true }));
                      }}
                      sizes="(max-width: 1024px) 50vw, 35vw"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous banner"
                className="hidden sm:flex absolute left-3 top-1/2 z-20 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white border border-slate-700/80 backdrop-blur-md transition-all hover:bg-slate-900 hover:scale-110"
              >
                <ChevronLeft className="h-5 w-5 text-slate-200" />
              </button>
              <button
                onClick={next}
                aria-label="Next banner"
                className="hidden sm:flex absolute right-3 top-1/2 z-20 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white border border-slate-700/80 backdrop-blur-md transition-all hover:bg-slate-900 hover:scale-110"
              >
                <ChevronRight className="h-5 w-5 text-slate-200" />
              </button>
            </>
          )}

          {/* Pagination Indicators matching IMAGE 2 */}
          {slides.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === current ? "w-7 bg-cyan-400 shadow-md shadow-cyan-400/50" : "w-2 bg-white/40 hover:bg-white/70"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Side Banner Card: Sports Zone */}
        <div className="lg:col-span-3 h-[150px] sm:h-[170px] lg:h-[390px]">
          <div className="h-full rounded-3xl border border-slate-200/90 bg-white p-4 shadow-sm relative overflow-hidden flex flex-row lg:flex-col justify-between items-center lg:items-start transition-all hover:border-slate-300 hover:shadow-md">
            <div className="flex-1 pr-2 lg:pr-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-white bg-slate-950 px-2.5 py-1 rounded-lg">
                SPORTS ZONE
              </span>

              <h3 className="text-base sm:text-lg font-black text-slate-950 leading-tight mt-2.5">
                Gear Up For The Game
              </h3>

              <p className="text-xs text-slate-500 mt-1 font-medium line-clamp-1 lg:line-clamp-2">
                Cricket, football, fitness & outdoor essentials in Nepal
              </p>

              <div className="mt-3 sm:mt-4">
                <Button
                  size="sm"
                  className="h-8 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-bold px-4 shadow-sm"
                  asChild
                >
                  <Link href="/categories/sports">
                    Explore Now <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Sports Category Illustration / Photo */}
            <div className="shrink-0 flex justify-end lg:w-full lg:mt-3">
              <div className="relative h-16 w-16 lg:h-28 lg:w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                <Image
                  src={
                    sportsImgFailed
                      ? "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80"
                      : "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80"
                  }
                  alt="Sports Zone"
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  onError={() => setSportsImgFailed(true)}
                  sizes="(max-width: 1024px) 100px, 200px"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
