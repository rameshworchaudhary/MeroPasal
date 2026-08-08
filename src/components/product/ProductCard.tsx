"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatCurrency } from "@/lib/utils";
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
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { addItem, isInCart } = useCart();
  const { isInWishlist, toggleItem: toggleWishlist } = useWishlist();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Click outside listener for mobile touch devices
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsTouchActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const discount = typeof product.discountPercentage === "number" && product.discountPercentage > 0
    ? product.discountPercentage
    : 0;

  const inCart = mounted ? isInCart(product.id) : false;
  const inWishlist = mounted ? isInWishlist(product.id) : false;
  const isOutOfStock = product.stock <= 0;

  const showActions = isHovered || isTouchActive;

  const handleCardClick = (e: React.MouseEvent) => {
    if (!showActions) {
      e.preventDefault();
      e.stopPropagation();
      setIsTouchActive(true);
    }
  };

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
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md",
        isTouchActive && "border-blue-400 ring-2 ring-blue-500/10 shadow-md",
        className
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        onClick={handleCardClick}
        className="flex flex-col flex-1"
      >
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-50/80 p-3">
          <Image
            src={imageError ? "/images/placeholder.jpg" : (product.thumbnailImage || "/images/placeholder.jpg")}
            alt={product.name}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {discount > 0 && (
              <span className="rounded-lg bg-slate-950 px-2 py-0.5 text-[10px] font-black text-white shadow-xs tracking-wider">
                -{discount}%
              </span>
            )}
            {product.isTrending && !discount && (
              <span className="rounded-lg bg-blue-600 px-2 py-0.5 text-[10px] font-black text-white shadow-xs">
                Trending
              </span>
            )}
            {product.stock > 0 && product.stock <= product.lowStockThreshold && (
              <span className="rounded-lg bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Out of Stock */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="rounded-xl bg-slate-950 px-3.5 py-1.5 text-xs font-black text-white border border-slate-700">
                Out of Stock
              </span>
            </div>
          )}

          {/* Top-right action icons overlay */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
            <button
              onClick={handleToggleWishlist}
              className={cn(
                "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-slate-200/80 shadow-xs transition-colors",
                inWishlist
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-white/90 backdrop-blur-xs text-slate-700 hover:bg-slate-950 hover:text-white hover:border-slate-950"
              )}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
            </button>

            <button
              onClick={handleViewProduct}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 backdrop-blur-xs text-slate-700 shadow-xs transition-all opacity-0 group-hover:opacity-100 hover:bg-slate-950 hover:text-white hover:border-slate-950"
              aria-label="View product"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col flex-1 justify-between p-3.5 sm:p-4">
          <div>
            {product.brand && (
              <p className="mb-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
                {product.brand}
              </p>
            )}

            <p className="mb-1.5 line-clamp-2 text-xs sm:text-sm font-bold leading-snug text-slate-900 group-hover:text-blue-600 transition-colors">
              {product.name}
            </p>

            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-3 w-3",
                        star <= Math.round(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-200 text-slate-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  ({product.reviewCount})
                </span>
              </div>
            )}
          </div>

          {/* Price & Free Delivery badge */}
          <div className="mt-2 pt-2 border-t border-slate-100">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-black text-slate-950">
                {formatCurrency(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xs text-slate-400 line-through font-semibold">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-1 mt-1.5 flex-wrap">
              {product.freeDelivery === true && (
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700 border border-emerald-200">
                  Free Delivery
                </span>
              )}
              {product.soldCount > 10 && (
                <p className="text-[10px] font-semibold text-slate-500">
                  {product.soldCount > 1000
                    ? `${Math.floor(product.soldCount / 1000)}k+ sold`
                    : `${product.soldCount}+ sold`}
                </p>
              )}
            </div>

            {/* Quick add buttons - Only shown when interacted with (hover / tap / click) */}
            <AnimatePresence>
              {showQuickAdd && !isOutOfStock && showActions && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: 10 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden pt-2 border-t border-slate-100 flex items-center gap-1.5"
                >
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || inCart}
                    className={cn(
                      "flex min-h-[36px] flex-1 items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-[10px] font-black uppercase tracking-wider transition-all shadow-xs active:scale-95",
                      inCart
                        ? "bg-slate-800 text-white"
                        : "bg-slate-950 text-white hover:bg-slate-800"
                    )}
                  >
                    {product.variants && product.variants.length > 0 ? (
                      <><Zap className="h-3.5 w-3.5 text-cyan-400" /> Options</>
                    ) : inCart ? (
                      <><ShoppingCart className="h-3.5 w-3.5 fill-current text-cyan-400" /> Added</>
                    ) : (
                      <><ShoppingCart className="h-3.5 w-3.5" /> Add to Cart</>
                    )}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex min-h-[36px] flex-1 items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-[10px] font-black uppercase tracking-wider transition-all shadow-xs active:scale-95 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400"
                  >
                    Buy Now
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
