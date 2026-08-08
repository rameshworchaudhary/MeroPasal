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
    image: "/images/hero/ayurveda.jpg",
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

  const getSlideImage = (slide: Banner | (typeof FALLBACK_BANNERS)[0], idx: number) => {
    const raw =
      (slide as Banner).image ||
      (slide as (typeof FALLBACK_BANNERS)[0]).image ||
      DEFAULT_HERO_BACKUP;
    const slideId = slide.id || `slide-${idx}`;
    return failedImages[slideId] ? DEFAULT_HERO_BACKUP : raw;
  };

  const currentImage = getSlideImage(currentSlide, current);
  const isDirectImage =
    currentImage.startsWith("data:") ||
    currentImage.startsWith("blob:") ||
    failedImages[currentSlide.id || `slide-${current}`];

  // For Desktop multi-card carousel (3 cards view)
  const desktopCardsCount = Math.min(3, slides.length);
  const desktopSlides = Array.from({ length: desktopCardsCount }, (_, i) => {
    const slideIdx = (current + i) % slides.length;
    return {
      slide: slides[slideIdx],
      originalIndex: slideIdx,
    };
  });

  return (
    <section
      className="max-w-[1400px] mx-auto px-3 sm:px-6 my-2 sm:my-4 relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ================= MOBILE VIEW (< md) ================= */}
      <div className="block md:hidden relative w-full overflow-hidden rounded-2xl bg-slate-950 aspect-[16/9] shadow-lg border border-slate-800/80">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full"
          >
            <Link
              href={resolveBannerHref(currentSlide)}
              className="relative block w-full h-full cursor-pointer"
              aria-label={(currentSlide as Banner).title || "Promotional Banner"}
            >
              <Image
                src={currentImage}
                alt={(currentSlide as Banner).title || "NexShop Hero Banner"}
                fill
                className="object-cover object-center w-full h-full"
                priority={current === 0}
                unoptimized={isDirectImage}
                onError={() => {
                  const sId = currentSlide.id || `slide-${current}`;
                  setFailedImages((prev) => ({ ...prev, [sId]: true }));
                }}
                sizes="100vw"
                referrerPolicy="no-referrer"
              />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ================= DESKTOP / LAPTOP / TABLET VIEW (>= md) ================= */}
      {/* Multi-card Carousel Grid matching Flipkart Desktop Design */}
      <div className="hidden md:block w-full">
        <div
          className={cn(
            "grid gap-3.5 lg:gap-5 w-full items-center",
            desktopCardsCount === 1 && "grid-cols-1 max-w-4xl mx-auto",
            desktopCardsCount === 2 && "grid-cols-2 max-w-5xl mx-auto",
            desktopCardsCount >= 3 && "grid-cols-3"
          )}
        >
          {desktopSlides.map(({ slide, originalIndex }, idx) => {
            const imgUrl = getSlideImage(slide, originalIndex);
            const isDirect =
              imgUrl.startsWith("data:") ||
              imgUrl.startsWith("blob:") ||
              failedImages[slide.id || `slide-${originalIndex}`];

            return (
              <motion.div
                key={`${slide.id || originalIndex}-${current}-${idx}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="relative w-full overflow-hidden rounded-2xl lg:rounded-3xl bg-slate-950 border border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 group/card aspect-[16/10]"
              >
                <Link
                  href={resolveBannerHref(slide)}
                  className="relative block w-full h-full cursor-pointer"
                  aria-label={(slide as Banner).title || "Promotional Banner"}
                >
                  {/* Subtle Background Fill Blur */}
                  <Image
                    src={imgUrl}
                    alt=""
                    fill
                    className="object-cover filter blur-md opacity-25 scale-105 pointer-events-none"
                    aria-hidden="true"
                    unoptimized={isDirect}
                    referrerPolicy="no-referrer"
                  />

                  {/* Main Banner Graphic Card */}
                  <Image
                    src={imgUrl}
                    alt={(slide as Banner).title || "NexShop Banner"}
                    fill
                    className="object-cover object-center w-full h-full transition-transform duration-500 group-hover/card:scale-[1.02]"
                    priority={idx === 0 && current === 0}
                    unoptimized={isDirect}
                    onError={() => {
                      const sId = slide.id || `slide-${originalIndex}`;
                      setFailedImages((prev) => ({ ...prev, [sId]: true }));
                    }}
                    sizes="(max-width: 1200px) 33vw, 450px"
                    referrerPolicy="no-referrer"
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ================= CONTROLS & PAGINATION ================= */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous banner"
            className="hidden sm:flex absolute -left-2 sm:left-1 lg:left-2 top-1/2 z-20 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/80 text-white border border-slate-700/80 backdrop-blur-md transition-all hover:bg-slate-900 hover:scale-110 shadow-xl"
          >
            <ChevronLeft className="h-6 w-6 text-slate-100" />
          </button>
          <button
            onClick={next}
            aria-label="Next banner"
            className="hidden sm:flex absolute -right-2 sm:right-1 lg:right-2 top-1/2 z-20 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/80 text-white border border-slate-700/80 backdrop-blur-md transition-all hover:bg-slate-900 hover:scale-110 shadow-xl"
          >
            <ChevronRight className="h-6 w-6 text-slate-100" />
          </button>
        </>
      )}

      {/* Pagination Indicators (Flipkart-style dots centered below) */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === current
                  ? "w-7 bg-blue-600 shadow-md shadow-blue-500/30 dark:bg-cyan-400 dark:shadow-cyan-400/50"
                  : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
