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
}

export default function NexShopLogo({
  href = "/",
  className,
  size = "md",
  showText = true,
}: NexShopLogoProps) {
  // Height configurations
  const heightMap = {
    sm: "h-8",
    md: "h-10 sm:h-11",
    lg: "h-12 sm:h-14",
  };

  const logoContent = (
    <div className={cn("inline-flex items-center gap-2 select-none", className)}>
      <div className={cn("relative aspect-[460/120] w-auto shrink-0", heightMap[size])}>
        <Image
          src="/images/logo.svg"
          alt="NexShop Nepal - Sabai Kura, Ekai Thau Ma"
          width={460}
          height={120}
          className="h-full w-auto object-contain"
          priority
        />
      </div>
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
