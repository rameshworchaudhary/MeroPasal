"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PackageOpen, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import type { Product } from "@/lib/types/product";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  loading = false,
  emptyMessage = "No products available in this category yet.",
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center px-4 rounded-2xl border border-neutral-200 bg-white shadow-2xs my-4">
        <div className="mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border border-neutral-300 bg-neutral-100 text-black">
          <PackageOpen className="h-8 w-8 sm:h-10 sm:w-10 text-neutral-800" />
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-black">
          No products available
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-md leading-relaxed">
          {emptyMessage}
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition-all uppercase tracking-wider"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, duration: 0.3 }}
          className="h-full"
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
