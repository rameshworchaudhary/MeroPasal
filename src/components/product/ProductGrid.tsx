"use client";

import React from "react";
import { motion } from "framer-motion";
import { PackageOpen } from "lucide-react";
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
  emptyMessage = "No products found",
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
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#d4b982] bg-[#f1ebe1]">
          <PackageOpen className="h-9 w-9 text-[#8b6b35]" />
        </div>
        <p className="font-serif text-xl tracking-wide text-[#292722]">{emptyMessage}</p>
        <p className="mt-2 text-sm text-[#777166]">
          Try adjusting your filters or search query
        </p>
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
