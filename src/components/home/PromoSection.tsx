"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Banner } from "@/lib/types/banner";

interface PromoSectionProps {
  banners: Banner[];
}

const FALLBACK_PROMOS = [
  {
    id: "p1",
    title: "Maha Dashain Dhamaka",
    subtitle: "Up to 70% off festival electronics & fashion",
    image: "/images/hero/maha-dashain.jpg",
    linkValue: "/products?featured=true",
  },
  {
    id: "p2",
    title: "Electronics & Tech Expo",
    subtitle: "Smartphones, Laptops, Earbuds & Smartwatches",
    image: "/images/hero/electronics.jpg",
    linkValue: "/categories/electronics",
  },
  {
    id: "p3",
    title: "Fashion & Trends",
    subtitle: "Authentic festival apparel, footwear & accessories",
    image: "/images/hero/fashion.jpg",
    linkValue: "/categories/fashion",
  },
];

export default function PromoSection({ banners }: PromoSectionProps) {
  const promos = banners.length >= 2 ? banners : FALLBACK_PROMOS;

  return (
    <section className="max-w-[1400px] mx-auto px-3 sm:px-6 my-4 sm:my-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-2xs">
        <div className="mb-4 flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-black mb-0.5">
              Special Highlights
            </p>
            <h2 className="font-serif text-base sm:text-xl font-bold text-black">
              The Nepal Seasonal Edit
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {promos.slice(0, 3).map((promo, index) => {
            const href = (promo as Banner).linkValue || (promo as (typeof FALLBACK_PROMOS)[0]).linkValue || "/products";
            const image = (promo as Banner).image || (promo as (typeof FALLBACK_PROMOS)[0]).image;
            const subtitle = (promo as Banner).subtitle || (promo as (typeof FALLBACK_PROMOS)[0]).subtitle;

            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link href={href}>
                  <div className="group relative h-36 sm:h-48 cursor-pointer overflow-hidden rounded-xl border border-neutral-200 bg-black shadow-2xs">
                    {image ? (
                      <>
                        <Image
                          src={image}
                          alt={promo.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-black" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-neutral-300">
                        NexShop Edit
                      </p>
                      <p className="font-serif text-base sm:text-lg font-bold leading-tight text-white">{promo.title}</p>
                      {subtitle && (
                        <p className="mt-0.5 text-xs text-neutral-300 line-clamp-1">{subtitle}</p>
                      )}
                      <span className="mt-2 inline-flex items-center text-[10px] font-bold text-white group-hover:underline">
                        Explore Collection <span className="ml-1">&rarr;</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
