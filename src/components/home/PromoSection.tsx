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
    title: "Electronics Sale",
    subtitle: "Up to 40% off",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    linkValue: "/categories/electronics",
    bgColor: "from-blue-900 to-blue-600",
  },
  {
    id: "p2",
    title: "Fashion Week",
    subtitle: "New arrivals daily",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80",
    linkValue: "/categories/fashion",
    bgColor: "from-pink-900 to-pink-600",
  },
  {
    id: "p3",
    title: "Home & Kitchen",
    subtitle: "Upgrade your space",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    linkValue: "/categories/home",
    bgColor: "from-amber-900 to-amber-600",
  },
];

export default function PromoSection({ banners }: PromoSectionProps) {
  const promos = banners.length >= 2 ? banners : FALLBACK_PROMOS;

  return (
    <section className="max-w-[1400px] mx-auto px-3 sm:px-6 my-4 sm:my-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-2xs">
        <div className="mb-3.5 sm:mb-4 flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-0.5">
              Special Highlights
            </p>
            <h2 className="font-serif text-base sm:text-xl font-extrabold text-slate-900">
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link href={href}>
                  <div className="group relative h-36 sm:h-48 cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xs">
                    {image ? (
                      <>
                        <Image
                          src={image}
                          alt={promo.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5 text-white">
                      <p className="mb-0.5 text-[9px] font-extrabold uppercase tracking-widest text-amber-300">
                        NexShop Special
                      </p>
                      <p className="font-serif text-base sm:text-xl font-bold leading-tight text-white">{promo.title}</p>
                      {subtitle && (
                        <p className="mt-0.5 text-xs text-slate-300 line-clamp-1">{subtitle}</p>
                      )}
                      <span className="mt-2 inline-flex items-center text-[10px] font-bold text-blue-400 group-hover:text-amber-300 transition-colors">
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
