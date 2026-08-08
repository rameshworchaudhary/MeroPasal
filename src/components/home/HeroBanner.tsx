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
    title: "Adivasi Vishvambhari Herbal Hair Oil",
    subtitle: "Save big on authentic recipes & 100% genuine herbal essentials",
    image: "/images/hero/Adivasi.jpg",
    buttonText: "Shop Now",
    linkValue: "/products?q=hair+oil",
    badge: "FLAT 50% OFF",
  },
  {
    id: "japanese-soothing-massage-gel",
    title: "Japanese Soothing Massage Gel",
    subtitle: "Premium natural relief & relaxation formula",
    image: "/images/hero/japan.jpg",
    buttonText: "Shop Now",
    linkValue: "/products?q=massage+gel",
    badge: "BESTSELLER",
  },
  {
    id: "paras-product",
    title: "Paras Herbal Essentials",
    subtitle: "Authentic herbal care for hair & skin wellness",
    image: "/images/hero/paras.jpg",
    buttonText: "Shop Now",
    linkValue: "/products?q=paras",
    badge: "SPECIAL OFFER",
  },
  {
    id: "Ayurveda-product",
    title: "Ayurveda Natural Collection",
    subtitle: "100% Pure & organic Ayurvedic formulations",
    image: "/images/hero/Ayurveda.jpg",
    buttonText: "Shop Now",
    linkValue: "/products?q=ayurveda",
    badge: "HERBAL SALE",
  },
  // {
  //   id: "dashain",
  //   title: "Maha Dashain Mega Dhamaka",
  //   subtitle: "Exclusive festival discounts on all top categories",
  //   image: "/images/hero/Fashain.jpg",
  //   buttonText: "Shop Dashain Deals",
  //   linkValue: "/categories/fashion",
  //   badge: "DASHAIN SALE",
  // },
  // {
  //   id: "tihar",
  //   title: "Tihar Lights & Celebration Sale",
  //   subtitle: "Brighten your home with special festive offers",
  //   image: "/images/hero/Tihar.jpg",
  //   buttonText: "Explore Tihar Specials",
  //   linkValue: "/categories/home",
  //   badge: "TIHAR SPECIAL",
  // },
  // {
  //   id: "electronics",
  //   title: "Nepal Electronics & Tech Expo",
  //   subtitle: "Top brands in smartphones, laptops & gadget accessories",
  //   image:
  //     "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1600&q=80",
  //   buttonText: "Shop Tech",
  //   linkValue: "/categories/electronics",
  //   badge: "TECH EXPO",
  // },
];

const DEFAULT_HERO_BACKUP =
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=80";

function resolveBannerHref(slide: Banner | (typeof FALLBACK_BANNERS)[0]): string {
  if ("linkType" in slide) {
    const banner = slide as Banner;
    const { linkType, linkValue, title } = banner;

    if (linkType === "category" && linkValue) {
      return `/categories/${linkValue}`;
    }
    if (linkType === "product" && linkValue) {
      return `/products/${linkValue}`;
    }
    if (linkType === "url" && linkValue) {
      if (linkValue === "/products" || linkValue === "/products?featured=true") {
        if (title) return `/products?q=${encodeURIComponent(title.trim())}`;
      }
      return linkValue.startsWith("/") ? linkValue : `/${linkValue}`;
    }
    if (title) {
      return `/products?q=${encodeURIComponent(title.trim())}`;
    }
    return "/products";
  }

  const fallbackSlide = slide as (typeof FALLBACK_BANNERS)[0];
  if (
    fallbackSlide.linkValue &&
    fallbackSlide.linkValue !== "/products" &&
    fallbackSlide.linkValue !== "/products?featured=true"
  ) {
    return fallbackSlide.linkValue;
  }

  if (fallbackSlide.title) {
    return `/products?q=${encodeURIComponent(fallbackSlide.title.trim())}`;
  }

  return "/products";
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
    <section className="max-w-[1400px] mx-auto px-3 sm:px-6 my-2 sm:my-4">
      {/* Full Width Hero Banner Slider Container - Responsive aspect ratio for 14"+ laptops and mobile */}
      <div
        className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-950 aspect-[16/9] sm:aspect-[2.2/1] md:aspect-[2.5/1] lg:aspect-[2.7/1] max-h-[460px] min-h-[200px] sm:min-h-[280px] flex items-center shadow-xl border border-slate-800/80 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl sm:rounded-3xl"
          >
            {/* Entire Hero Image is a Clickable Link to Related Products */}
            <Link
              href={resolveBannerHref(currentSlide)}
              className="relative block w-full h-full cursor-pointer group"
              aria-label={(currentSlide as Banner).title || "Promotional Banner"}
            >
              {/* Subtle Ambient Background Blur for ultra-wide / edge filling */}
              <Image
                src={bgImage}
                alt=""
                fill
                className="object-cover filter blur-lg opacity-30 scale-105 pointer-events-none"
                aria-hidden="true"
                unoptimized={isDirectImage}
                sizes="100vw"
                referrerPolicy="no-referrer"
              />

              {/* Main Pristine Banner Image - Full Cover, No HTML Overlays */}
              <Image
                src={bgImage}
                alt={(currentSlide as Banner).title || "NexShop Hero Banner"}
                fill
                className="object-cover object-center w-full h-full transition-transform duration-700 group-hover:scale-[1.015]"
                priority={current === 0}
                unoptimized={isDirectImage}
                onError={() => {
                  setFailedImages((prev) => ({ ...prev, [slideId]: true }));
                }}
                sizes="100vw"
                referrerPolicy="no-referrer"
              />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Slider Controls */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous banner"
              className="hidden sm:flex absolute left-4 top-1/2 z-20 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white border border-slate-700/80 backdrop-blur-md transition-all hover:bg-slate-900 hover:scale-110 shadow-lg"
            >
              <ChevronLeft className="h-6 w-6 text-slate-100" />
            </button>
            <button
              onClick={next}
              aria-label="Next banner"
              className="hidden sm:flex absolute right-4 top-1/2 z-20 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white border border-slate-700/80 backdrop-blur-md transition-all hover:bg-slate-900 hover:scale-110 shadow-lg"
            >
              <ChevronRight className="h-6 w-6 text-slate-100" />
            </button>
          </>
        )}

        {/* Pagination Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-950/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === current ? "w-8 bg-cyan-400 shadow-md shadow-cyan-400/50" : "w-2 bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
