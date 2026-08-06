"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatCurrency, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/lib/types/product";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickAdd?: boolean;
}

export default function ProductCard({
  product,
  className,
  showQuickAdd = true,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { addItem, isInCart } = useCart();
  const { isInWishlist, toggleItem: toggleWishlist } = useWishlist();
  const router = useRouter();

  // Fix hydration mismatch — Zustand reads localStorage on client only
  useEffect(() => {
    setMounted(true);
  }, []);

  const discount = typeof product.discountPercentage === "number" && product.discountPercentage > 0
    ? product.discountPercentage
    : 0;

  // Default to false on server, real value on client
  const inCart = mounted ? isInCart(product.id) : false;
  const inWishlist = mounted ? isInWishlist(product.id) : false;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    if (product.variants && product.variants.length > 0) return;

    setIsAddingToCart(true);
    try {
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.thumbnailImage,
        price: product.price,
        comparePrice: product.comparePrice,
        quantity: 1,
        stock: product.stock,
      });
      toast.success(`${product.name} added to cart!`);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    if (product.variants && product.variants.length > 0) {
      router.push(`/products/${product.slug}`);
      return;
    }
    if (!inCart) {
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.thumbnailImage,
        price: product.price,
        comparePrice: product.comparePrice,
        quantity: 1,
        stock: product.stock,
      });
    }
    router.push("/checkout");
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.thumbnailImage,
      price: product.price,
      comparePrice: product.comparePrice,
    });
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleViewProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${product.slug}`);
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs transition-all duration-300 hover:border-blue-400 hover:shadow-md",
        className
      )}
    >
      <Link href={`/products/${product.slug}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
          <Image
            src={imageError ? "/images/placeholder.jpg" : (product.thumbnailImage || "/images/placeholder.jpg")}
            alt={product.name}
            fill
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {discount > 0 && (
              <Badge className="border-0 bg-rose-600 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wide text-white shadow-xs">
                {discount}% OFF
              </Badge>
            )}
            {product.isTrending && !discount && (
              <Badge className="border-0 bg-amber-500 px-1.5 sm:px-2 py-0.5 text-[9px] font-bold tracking-wide text-slate-950">
                Trending
              </Badge>
            )}
            {product.stock > 0 && product.stock <= product.lowStockThreshold && (
              <Badge variant="warning" className="text-[9px] sm:text-[10px] px-1.5 py-0.5">
                Only {product.stock} left
              </Badge>
            )}
          </div>

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-2xs flex items-center justify-center z-10">
              <span className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-bold text-white shadow-sm">
                Out of Stock
              </span>
            </div>
          )}

          {/* Action buttons overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleToggleWishlist}
              className={cn(
                "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-slate-200 shadow-sm transition-colors",
                inWishlist
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-white/90 backdrop-blur-xs text-slate-700 hover:bg-slate-900 hover:text-white"
              )}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
            </button>

            <button
              onClick={handleViewProduct}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 backdrop-blur-xs text-slate-700 shadow-sm transition-colors hover:bg-slate-900 hover:text-white"
              aria-label="View product"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          {/* Quick add buttons */}
          {showQuickAdd && !isOutOfStock && (
            <div className="absolute bottom-0 left-0 right-0 z-10 flex sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-200">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || inCart}
                className={cn(
                  "flex min-h-[36px] sm:min-h-[40px] flex-1 items-center justify-center gap-1.5 py-1.5 sm:py-2 px-2 text-[10px] font-extrabold uppercase tracking-wider transition-colors shadow-xs",
                  inCart
                    ? "bg-emerald-600 text-white"
                    : "bg-blue-600 sm:bg-slate-900 text-white hover:bg-blue-700"
                )}
              >
                {product.variants && product.variants.length > 0 ? (
                  <><Zap className="h-3.5 w-3.5" /> Options</>
                ) : inCart ? (
                  <><ShoppingCart className="h-3.5 w-3.5 fill-current" /> Added</>
                ) : (
                  <><ShoppingCart className="h-3.5 w-3.5" /> Add to Cart</>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex min-h-[36px] sm:min-h-[40px] flex-1 items-center justify-center gap-1.5 py-1.5 sm:py-2 px-2 text-[10px] font-extrabold uppercase tracking-wider transition-colors shadow-xs bg-amber-500 text-white hover:bg-amber-600"
              >
                Buy Now
              </button>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col flex-1 justify-between p-2.5 sm:p-3.5">
          <div>
            {product.brand && (
              <p className="mb-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {product.brand}
              </p>
            )}

            <p className="mb-1 line-clamp-2 text-xs sm:text-sm font-bold leading-tight text-slate-800 group-hover:text-blue-600 transition-colors">
              {product.name}
            </p>

            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1 mb-1">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-2.5 w-2.5 sm:h-3 sm:w-3",
                        star <= Math.round(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-200 text-slate-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">
                  ({product.reviewCount})
                </span>
              </div>
            )}
          </div>

          {/* Price & Free Delivery badge */}
          <div className="mt-1 pt-1.5 border-t border-slate-100">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-extrabold text-slate-900">
                {formatCurrency(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through font-medium">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-1 mt-1 flex-wrap">
              {product.freeDelivery === true && (
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-700 border border-emerald-200/80">
                  Free Delivery
                </span>
              )}
              {product.soldCount > 10 && (
                <p className="text-[10px] font-medium text-slate-400">
                  {product.soldCount > 1000
                    ? `${Math.floor(product.soldCount / 1000)}k+ sold`
                    : `${product.soldCount}+ sold`}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}