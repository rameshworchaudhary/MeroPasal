"use client";

import React from "react";
import Image from "next/image";
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
  variant = "light",
}: NexShopLogoProps) {
  // Height configurations
  const heightMap = {
    sm: "h-7 sm:h-8",
    md: "h-9 sm:h-10 lg:h-11",
    lg: "h-11 sm:h-12 lg:h-14",
  };

  const isDark = variant === "dark";

  const logoContent = (
    <div className={cn("inline-flex items-center gap-2 select-none", className)}>
      {isDark ? (
        <div className="flex items-center gap-2.5">
          {/* Circular Badge Logo with Gradient Ring */}
          <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-900 p-[2px] shadow-md ring-2 ring-indigo-500/30">
            <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="h-full w-full p-1.5">
                <defs>
                  <linearGradient id="ringGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF007F" />
                    <stop offset="50%" stopColor="#FF5500" />
                    <stop offset="100%" stopColor="#00A2FF" />
                  </linearGradient>
                  <linearGradient id="shopTextDark" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF33A0" />
                    <stop offset="100%" stopColor="#38BDF8" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#ringGradDark)" strokeWidth="6" />
                <path d="M 28 32 C 28 27 32 24 37 27 L 54 48 L 54 30 C 54 25 61 24 62 29 L 62 62 C 62 67 57 70 52 67 L 35 45 L 35 63 C 35 68 28 68 28 63 Z" fill="#FFFFFF" />
                <path d="M 32 68 C 42 70 55 64 66 48 C 68 45 72 48 70 52 C 58 72 42 76 29 71 C 27 70 29 67 32 68 Z" fill="#38BDF8" />
                <g transform="translate(51, 16)">
                  <path d="M 8 7 C 8 2 16 2 16 7" fill="none" stroke="#FF7700" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 4 8 C 4 6 6 5 8 5 L 16 5 C 18 5 20 6 20 8 L 22 22 C 22 24 20 26 18 26 L 6 26 C 4 26 2 24 2 22 Z" fill="#FF7700" />
                </g>
              </svg>
            </div>
          </div>

          {showText && (
            <div className="flex flex-col">
              <div className="flex items-baseline font-black tracking-tight text-lg sm:text-2xl leading-none">
                <span className="text-white drop-shadow-xs">Nex</span>
                <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Shop
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-slate-300 mt-0.5">
                <span className="h-[1px] w-2 bg-slate-600"></span>
                <span>SABAI KURA, EKAI THAU MA</span>
                <span className="h-[1px] w-2 bg-slate-600"></span>
                <span className="rounded-full bg-blue-600 px-1.5 py-0.2 text-[7px] text-white">NEPAL</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={cn("relative aspect-[500/130] w-auto shrink-0", heightMap[size])}>
          <Image
            src="/images/logo.svg"
            alt="NexShop Nepal - Sabai Kura, Ekai Thau Ma"
            width={500}
            height={130}
            className="h-full w-auto object-contain"
            priority
          />
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

