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
  const { addItem, isInCart } = useCart();
  const { isInWishlist, toggleItem: toggleWishlist } = useWishlist();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const discount = typeof product.discountPercentage === "number" && product.discountPercentage > 0
    ? product.discountPercentage
    : 0;

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
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xs transition-all duration-200 hover:border-black hover:shadow-sm",
        className
      )}
    >
      <Link href={`/products/${product.slug}`} className="flex flex-col flex-1">
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-50">
          <Image
            src={imageError ? "/images/placeholder.jpg" : (product.thumbnailImage || "/images/placeholder.jpg")}
            alt={product.name}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {discount > 0 && (
              <span className="rounded-md bg-black px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-2xs">
                -{discount}%
              </span>
            )}
            {product.isTrending && !discount && (
              <span className="rounded-md bg-neutral-900 px-1.5 sm:px-2 py-0.5 text-[9px] font-bold text-white shadow-2xs">
                Trending
              </span>
            )}
            {product.stock > 0 && product.stock <= product.lowStockThreshold && (
              <span className="rounded-md bg-neutral-800 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Out of Stock */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <span className="rounded-md bg-black px-3 py-1 text-xs font-bold text-white">
                Out of Stock
              </span>
            </div>
          )}

          {/* Action buttons overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleToggleWishlist}
              className={cn(
                "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-neutral-300 shadow-2xs transition-colors",
                inWishlist
                  ? "bg-black text-white border-black"
                  : "bg-white text-neutral-800 hover:bg-black hover:text-white hover:border-black"
              )}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
            </button>

            <button
              onClick={handleViewProduct}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-800 shadow-2xs transition-colors hover:bg-black hover:text-white hover:border-black"
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
                  "flex min-h-[36px] sm:min-h-[40px] flex-1 items-center justify-center gap-1.5 py-1.5 sm:py-2 px-2 text-[10px] font-bold uppercase tracking-wider transition-colors shadow-2xs",
                  inCart
                    ? "bg-neutral-800 text-white"
                    : "bg-black text-white hover:bg-neutral-800"
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
                className="flex min-h-[36px] sm:min-h-[40px] flex-1 items-center justify-center gap-1.5 py-1.5 sm:py-2 px-2 text-[10px] font-bold uppercase tracking-wider transition-colors shadow-2xs bg-neutral-100 text-black border-l border-neutral-200 hover:bg-neutral-200"
              >
                Buy Now
              </button>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col flex-1 justify-between p-3 sm:p-3.5">
          <div>
            {product.brand && (
              <p className="mb-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                {product.brand}
              </p>
            )}

            <p className="mb-1 line-clamp-2 text-xs sm:text-sm font-bold leading-tight text-neutral-900 group-hover:text-neutral-700 transition-colors">
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
                          ? "fill-black text-black"
                          : "fill-neutral-200 text-neutral-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-neutral-500">
                  ({product.reviewCount})
                </span>
              </div>
            )}
          </div>

          {/* Price & Free Delivery badge */}
          <div className="mt-1 pt-1.5 border-t border-neutral-100">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-extrabold text-black">
                {formatCurrency(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-[10px] sm:text-xs text-neutral-400 line-through font-medium">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-1 mt-1 flex-wrap">
              {product.freeDelivery === true && (
                <span className="inline-flex items-center rounded-md bg-neutral-100 px-1.5 py-0.5 text-[9px] font-bold text-neutral-900 border border-neutral-300">
                  Free Delivery
                </span>
              )}
              {product.soldCount > 10 && (
                <p className="text-[10px] font-medium text-neutral-500">
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
