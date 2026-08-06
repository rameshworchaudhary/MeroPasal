"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Heart, Star, ChevronRight, Share2, Shield,
  Truck, RotateCcw, Minus, Plus, CheckCircle, AlertCircle,
  ThumbsUp, User, ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import {
  formatCurrency, calculateDiscount, getInitials,
  getStarRating, formatDateTime,
} from "@/lib/utils";
import { incrementProductViewCount } from "@/lib/firebase/products";
import { recordRecentlyViewed } from "@/lib/firebase/users";
import { markReviewHelpful } from "@/lib/firebase/reviews";
import type { Product } from "@/lib/types/product";
import type { Review, ReviewSummary } from "@/lib/types/review";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface ProductDetailClientProps {
  product: Product;
  reviews: Review[];
  reviewSummary: ReviewSummary;
}

export default function ProductDetailClient({
  product, reviews, reviewSummary,
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [isZoomed, setIsZoomed] = useState(false);
  const router = useRouter();

  const { addItem, isInCart } = useCart();
  const { isInWishlist, toggleItem: toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const discount = typeof product.discountPercentage === "number" && product.discountPercentage > 0
    ? product.discountPercentage
    : 0;

  const inCart = isInCart(product.id, selectedVariants);
  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const images = product.images?.length > 0
    ? product.images
    : [product.thumbnailImage || "/images/placeholder.jpg"];

  useEffect(() => {
    incrementProductViewCount(product.id).catch(() => {});
    if (user) {
      recordRecentlyViewed(user.uid, product.id).catch(() => {});
    }
  }, [product.id, user]);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const hasUnselectedVariants = product.variants?.some(
      (v) => !selectedVariants[v.name]
    );
    if (hasUnselectedVariants) {
      toast.error("Please select all options before adding to cart");
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.thumbnailImage,
      price: product.price,
      comparePrice: product.comparePrice,
      quantity,
      stock: product.stock,
      variant: Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined,
    });
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const hasUnselectedVariants = product.variants?.some(
      (v) => !selectedVariants[v.name]
    );
    if (hasUnselectedVariants) {
      toast.error("Please select all options before proceeding");
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
        quantity,
        stock: product.stock,
        variant: Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined,
      });
    }
    router.push("/checkout");
  };

  const handleToggleWishlist = () => {
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

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await markReviewHelpful(reviewId);
      toast.success("Marked as helpful!");
    } catch {
      toast.error("Failed to mark as helpful");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:py-14">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8e887d]">
        <Link href="/" className="transition-colors hover:text-[#8b6b35]">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/categories" className="transition-colors hover:text-[#8b6b35]">Categories</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/categories/${product.categoryId}`} className="transition-colors hover:text-[#8b6b35]">
          {product.categoryName}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="line-clamp-1 font-semibold text-[#514c43]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
        {/* ── Image Gallery ── */}
        <div className="space-y-3">
          {/* Main image */}
          <div
            className="relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-[#ded6ca] bg-[#f1ebe2]"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[selectedImage] || "/images/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className={cn(
                    "object-contain transition-transform duration-300",
                    isZoomed ? "scale-150" : "scale-100"
                  )}
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>
            {discount > 0 && (
              <Badge className="absolute left-4 top-4 border-0 bg-[#292722] px-3 py-1.5 text-xs font-semibold text-[#f8f5ef]">
                {discount}% OFF
              </Badge>
            )}
            <div className="absolute right-4 top-4 rounded-full border border-white/50 bg-[#292722]/60 p-2 text-white backdrop-blur-sm">
              <ZoomIn className="h-4 w-4" />
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                    selectedImage === i
                      ? "border-[#b99558] shadow-md"
                      : "border-transparent hover:border-[#b99558]"
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div className="space-y-6">
          {product.brand && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b6b35]">
              {product.brand}
            </p>
          )}

          <h1 className="font-serif text-3xl leading-[1.1] tracking-wide text-[#292722] sm:text-4xl">{product.name}</h1>

          {/* Rating summary */}
          {reviewSummary.totalReviews > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {getStarRating(reviewSummary.averageRating).map((type, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      type === "full"
                        ? "fill-yellow-400 text-yellow-400"
                        : type === "half"
                        ? "fill-yellow-200 text-yellow-400"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="font-semibold text-[#514c43]">{reviewSummary.averageRating.toFixed(1)}</span>
              <a href="#reviews" className="text-sm text-[#8b6b35] hover:underline">
                ({reviewSummary.totalReviews} reviews)
              </a>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm text-[#8e887d]">
                {product.soldCount}+ sold
              </span>
            </div>
          )}

          {/* Price */}
          <div className="space-y-1 rounded-xl border border-[#ded6ca] bg-[#f1ebe1] p-5">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-[#8b6b35]">
                {formatCurrency(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-lg text-[#9a9388] line-through">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
              {discount > 0 && (
                <Badge className="border-0 bg-[#292722] text-sm text-[#f8f5ef]">
                  Save {formatCurrency(product.comparePrice! - product.price)}
                </Badge>
              )}
            </div>
            <p className="text-xs text-[#777166]">Inclusive of all taxes</p>
          </div>

          {/* Stock status */}
          {isOutOfStock ? (
            <div className="flex items-center gap-2 font-medium text-[#a84d45]">
              <AlertCircle className="h-4 w-4" />
              <span>Out of Stock</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 font-medium text-[#596d55]">
              <CheckCircle className="h-4 w-4" />
              <span>
                In Stock
                {product.stock <= product.lowStockThreshold && (
                  <span className="ml-2 text-sm font-normal text-[#a87938]">
                    (Only {product.stock} left!)
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Variants */}
          {product.variants && product.variants.map((variant) => (
            <div key={variant.id}>
              <p className="mb-2 text-sm font-semibold text-[#514c43]">
                {variant.name}:
                {selectedVariants[variant.name] && (
                    <span className="ml-2 font-normal text-[#8e887d]">
                    {selectedVariants[variant.name]}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {variant.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() =>
                      setSelectedVariants((prev) => ({ ...prev, [variant.name]: opt }))
                    }
                    className={cn(
                      "min-h-[44px] rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                      selectedVariants[variant.name] === opt
                        ? "border-[#b99558] bg-[#f1ebe1] text-[#8b6b35]"
                        : "border-[#d8d0c4] text-[#514c43] hover:border-[#b99558]"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity + actions */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <div className="flex items-center overflow-hidden rounded-full border border-[#cfc5b7] bg-[#f8f5ef]">
              <button
                className="px-3.5 py-2.5 min-h-[44px] transition-colors hover:bg-[#eee8de] disabled:opacity-50"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[2.5rem] px-3 py-2 text-center font-semibold text-[#514c43]">{quantity}</span>
              <button
                className="px-3.5 py-2.5 min-h-[44px] transition-colors hover:bg-[#eee8de] disabled:opacity-50"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock || isOutOfStock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1 min-h-[44px] rounded-full bg-[#292722] text-[#f8f5ef] hover:bg-[#4a463e]"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isOutOfStock ? "Out of Stock" : inCart ? "Added to Cart" : "Add to Cart"}
            </Button>
            <Button
              size="lg"
              className="flex-1 min-h-[44px] rounded-full bg-[#b99558] text-white hover:bg-[#a3813f]"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
            >
              Buy Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleToggleWishlist}
              className={cn("min-h-[44px] min-w-[44px] rounded-full border-[#cfc5b7] text-[#514c43] hover:border-[#b99558] hover:bg-[#f1ebe1]", inWishlist && "border-[#b99558] text-[#8b6b35]")}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-primary text-primary")} />
            </Button>
            <Button size="lg" variant="ghost" className="min-h-[44px] min-w-[44px] rounded-full text-[#514c43] hover:bg-[#f1ebe1]" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Delivery info */}
          <div className="space-y-4 rounded-xl border border-[#ded6ca] bg-[#fcfaf6] p-5">
            {product.freeDelivery === true && (
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#8b6b35]" />
                <div>
                  <p className="text-sm font-medium text-[#514c43]">Free Delivery</p>
                  <p className="text-xs text-[#8e887d]">Free delivery available on this item</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <RotateCcw className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#8b6b35]" />
              <div>
                <p className="text-sm font-medium text-[#514c43]">7-Day Return Policy</p>
                <p className="text-xs text-[#8e887d]">Easy hassle-free returns</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#8b6b35]" />
              <div>
                <p className="text-sm font-medium text-[#514c43]">100% Secure Payment</p>
                <p className="text-xs text-[#8e887d]">eSewa & Khalti</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Link key={tag} href={`/search?q=${tag}`}>
                  <Badge variant="outline" className="cursor-pointer border-[#d8d0c4] text-xs text-[#777166] hover:border-[#b99558] hover:text-[#8b6b35]">
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs: Description / Specs / Reviews ── */}
      <div className="mt-12" id="reviews">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 gap-0">
            {["description", "specifications", "reviews"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent capitalize px-5 py-3"
              >
                {tab}
                {tab === "reviews" && ` (${reviewSummary.totalReviews})`}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Description */}
          <TabsContent value="description" className="pt-6">
            <div
              className="prose prose-sm max-w-none text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, "<br/>") }}
            />
          </TabsContent>

          {/* Specifications */}
          <TabsContent value="specifications" className="pt-6">
            {product.specifications?.length > 0 ? (
              <div className="rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                        <td className="px-4 py-3 font-medium text-foreground w-1/3 border-r">
                          {spec.key}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No specifications available.</p>
            )}
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews" className="pt-6">
            {reviewSummary.totalReviews > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Rating summary */}
                <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-xl">
                  <span className="text-5xl font-bold text-primary">
                    {reviewSummary.averageRating.toFixed(1)}
                  </span>
                  <div className="flex mt-2">
                    {getStarRating(reviewSummary.averageRating).map((t, i) => (
                      <Star
                        key={i}
                        className={cn("h-5 w-5", t === "full" ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted")}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {reviewSummary.totalReviews} reviews
                  </p>
                </div>

                {/* Breakdown bars */}
                <div className="md:col-span-2 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviewSummary.ratingBreakdown[star as 1 | 2 | 3 | 4 | 5];
                    const pct = reviewSummary.totalReviews > 0
                      ? Math.round((count / reviewSummary.totalReviews) * 100)
                      : 0;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-16 justify-end flex-shrink-0">
                          <span className="text-sm">{star}</span>
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        </div>
                        <Progress value={pct} className="flex-1 h-2" />
                        <span className="text-xs text-muted-foreground w-10">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Individual reviews */}
            <div className="space-y-5">
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Star className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No reviews yet</p>
                  <p className="text-sm">Be the first to review this product!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border rounded-xl p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={review.userPhoto} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {getInitials(review.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{review.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={cn(
                              "h-3.5 w-3.5",
                              s <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    {review.title && (
                      <p className="font-semibold text-sm">{review.title}</p>
                    )}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                    <div className="flex items-center gap-3">
                      {review.isVerifiedPurchase && (
                        <Badge variant="success" className="text-xs gap-1">
                          <CheckCircle className="h-3 w-3" /> Verified Purchase
                        </Badge>
                      )}
                      <button
                        onClick={() => handleMarkHelpful(review.id)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors ml-auto"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        Helpful ({review.helpfulCount})
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!user && (
              <div className="mt-6 p-4 border rounded-xl bg-muted/30 text-center">
                <p className="text-sm text-muted-foreground">
                  <Link href="/login" className="text-primary font-medium hover:underline">
                    Login
                  </Link>{" "}
                  to write a review for this product.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}