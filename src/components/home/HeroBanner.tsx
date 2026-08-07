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
    id: "dashain",
    title: "Maha Dashain Mega Dhamaka",
    subtitle:
      "Celebrate Nepal's biggest festival with up to 70% OFF + Flat Rs. 1,000 Vouchers",
    image: "/images/hero/dashain.jpg",
    buttonText: "Shop Dashain Deals",
    linkValue: "/products?featured=true",
    badge: "DASHAIN SALE 2083",
  },
  {
    id: "electronics",
    title: "Nepal Electronics & Tech Expo",
    subtitle:
      "Unbeatable deals on 5G Smartphones, Laptops, Smart TVs & accessories",
    image: "/images/hero/Electronic.jpg",
    buttonText: "Shop Tech",
    linkValue: "/categories/electronics",
    badge: "TECH EXPO",
  },
  {
    id: "tihar",
    title: "Tihar Lights & Celebration Sale",
    subtitle:
      "Illuminate your home! Discounts on Decorative LED Lights, Dry Fruits & Appliances",
    image: "/images/hero/Tihar.jpg",
    buttonText: "Explore Tihar Specials",
    linkValue: "/categories/home",
    badge: "TIHAR SPECIAL",
  },
  {
    id: "fashion",
    title: "Fashion Carnival & Trends",
    subtitle:
      "Authentic Kurti Sets, Dhaka Topi, Sneakers and Premium Western Wear",
    image: "/images/hero/Fashion.jpg",
    buttonText: "Explore Fashion",
    linkValue: "/categories/fashion",
    badge: "FASHION CARNIVAL",
  },
];

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
    (currentSlide as (typeof FALLBACK_BANNERS)[0]).badge || "SPECIAL OFFER";

  return (
    <section className="max-w-[1400px] mx-auto px-3 sm:px-6 my-3 sm:my-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        {/* Main Hero Banner Slider */}
        <div
          className="lg:col-span-9 relative overflow-hidden rounded-xl bg-black h-[220px] sm:h-[300px] lg:h-[360px] flex items-center shadow-sm group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center"
            >
              <Image
                src={bgImage}
                alt={(currentSlide as Banner).title || "NexShop Banner"}
                fill
                className="object-cover object-center"
                priority={current === 0}
                sizes="(max-width: 1024px) 100vw, 75vw"
                referrerPolicy="no-referrer"
              />

              {/* Black Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />

              {/* Slide Content */}
              <div className="relative z-10 p-4 sm:p-8 max-w-[90%] sm:max-w-lg text-white">
                <div className="inline-flex items-center gap-1.5 rounded-md bg-white/20 border border-white/30 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md mb-2">
                  <Tag className="h-3 w-3" />
                  <span>{badgeText}</span>
                </div>

                <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight font-serif leading-tight text-white">
                  {(currentSlide as Banner).title}
                </h1>

                {(currentSlide as Banner).subtitle && (
                  <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-neutral-300 line-clamp-2 max-w-md">
                    {(currentSlide as Banner).subtitle}
                  </p>
                )}

                <div className="mt-3 sm:mt-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    className="rounded-lg bg-white text-black hover:bg-neutral-200 px-4 py-1.5 h-8 text-xs font-bold shadow-xs transition-all"
                    asChild
                  >
                    <Link href={resolveBannerHref(currentSlide)}>
                      {(currentSlide as Banner).buttonText || "Shop Now"} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Arrows */}
          {slides.length > 1 && (
            <button
              onClick={prev}
              aria-label="Previous banner"
              className="hidden sm:flex absolute left-3 top-1/2 z-20 h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white border border-white/20 transition-all hover:bg-black hover:scale-105"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {slides.length > 1 && (
            <button
              onClick={next}
              aria-label="Next banner"
              className="hidden sm:flex absolute right-3 top-1/2 z-20 h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white border border-white/20 transition-all hover:bg-black hover:scale-105"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {/* Pagination Indicators */}
          {slides.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === current ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Side Banner Card: Sports Zone */}
        <div className="lg:col-span-3 h-[140px] sm:h-[160px] lg:h-[360px]">
          <div className="h-full rounded-xl border border-neutral-200 bg-white p-4 shadow-2xs relative overflow-hidden flex flex-row lg:flex-col justify-between items-center lg:items-start transition-all hover:border-black">
            <div className="flex-1 pr-2 lg:pr-0">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white bg-black px-2 py-0.5 rounded-md">
                Sports Zone
              </span>

              <h3 className="text-sm sm:text-base lg:text-lg font-extrabold text-black leading-tight mt-2">
                Gear Up For The Game
              </h3>

              <p className="text-[11px] text-neutral-600 mt-0.5 font-medium line-clamp-1 lg:line-clamp-2">
                Fitness, cricket, football & outdoor sports essentials
              </p>

              <div className="mt-2 sm:mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 rounded-lg border-black bg-black text-white hover:bg-neutral-800 text-[11px] font-bold px-3"
                  asChild
                >
                  <Link href="/categories/sports">
                    Explore Now <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Sports Category Photo */}
            <div className="shrink-0 flex justify-end lg:w-full lg:mt-3">
              <div className="relative h-14 w-14 lg:h-20 lg:w-20 overflow-hidden rounded-lg border border-neutral-200">
                <Image
                  src="/images/hero/sports-zone.jpg"
                  alt="Sports Zone"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
