"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NexShopLogoProps {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "light" | "dark" | "auto";
}

export default function NexShopLogo({
  href = "/",
  className,
  size = "md",
  showText = true,
  variant = "dark",
}: NexShopLogoProps) {
  const isDark = variant === "dark";

  // Height configurations
  const logoContent = (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {/* Circular Emblem Badge matching IMAGE 1 */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className={cn(
            "drop-shadow-md transition-transform duration-200 group-hover:scale-105",
            size === "sm" ? "h-8 w-8" : size === "md" ? "h-10 w-10 sm:h-12 sm:w-12" : "h-14 w-14"
          )}
        >
          <defs>
            {/* Multi-color Gradient Ring matching Image 1 */}
            <linearGradient id="rainbowRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e6007e" />
              <stop offset="20%" stopColor="#ff3300" />
              <stop offset="40%" stopColor="#ffaa00" />
              <stop offset="65%" stopColor="#00bfff" />
              <stop offset="85%" stopColor="#0055ff" />
              <stop offset="100%" stopColor="#8a00e6" />
            </linearGradient>

            {/* Swoosh Cyan/Blue Gradient */}
            <linearGradient id="swooshGrad" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#0072ff" />
              <stop offset="100%" stopColor="#00c6ff" />
            </linearGradient>

            {/* Shopping Bag Orange Gradient */}
            <linearGradient id="bagGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffa000" />
              <stop offset="100%" stopColor="#ff7700" />
            </linearGradient>
          </defs>

          {/* White Outer Circle Base */}
          <circle cx="50" cy="50" r="47" fill="#FFFFFF" />

          {/* Rainbow Gradient Border Ring */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="url(#rainbowRingGrad)"
            strokeWidth="5"
          />

          {/* Dark Navy Stylized 'N' */}
          <path
            d="M 27 34 C 27 28 32 25 38 29 L 55 50 L 55 33 C 55 28 62 28 62 33 L 62 65 C 62 70 57 73 51 69 L 34 47 L 34 65 C 34 70 27 70 27 65 Z"
            fill="#0b1329"
          />

          {/* Dynamic Blue/Cyan Swoosh Underline */}
          <path
            d="M 32 71 C 42 73 56 66 68 49 C 70 46 74 49 71 53 C 58 74 42 78 28 73 C 26 72 28 69 32 71 Z"
            fill="url(#swooshGrad)"
          />

          {/* Orange Shopping Bag Graphic */}
          <g transform="translate(51, 19)">
            {/* Bag Handle */}
            <path
              d="M 7 8 C 7 3 15 3 15 8"
              fill="none"
              stroke="#ff7700"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Bag Body */}
            <path
              d="M 3 9 C 3 7 5 6 7 6 L 15 6 C 17 6 19 7 19 9 L 21 24 C 21 26 19 28 17 28 L 5 28 C 3 28 1 26 1 24 Z"
              fill="url(#bagGrad)"
            />
            {/* Bag Eyelet Dots */}
            <circle cx="7" cy="11" r="1.5" fill="#FFFFFF" />
            <circle cx="15" cy="11" r="1.5" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

      {/* Typography and Tagline */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline font-black tracking-tight text-lg sm:text-2xl leading-none">
            <span className={isDark ? "text-white" : "text-slate-900"}>Nex</span>
            <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Shop
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-300 mt-1">
            <span className="h-[1px] w-2 bg-slate-600 hidden sm:inline-block" />
            <span className={isDark ? "text-slate-300" : "text-slate-700"}>SABAI KURA, EKAI THAU MA</span>
            <span className="h-[1px] w-2 bg-slate-600 hidden sm:inline-block" />
            <span className="rounded-full bg-blue-600 px-1.5 py-0.2 text-[7px] sm:text-[8px] font-extrabold text-white">
              NEPAL
            </span>
          </div>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center" aria-label="NexShop Nepal Home">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
