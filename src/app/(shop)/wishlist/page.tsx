"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/ProductCard";
import { useWishlist } from "@/hooks/useWishlist";
import { getProductsByIds } from "@/lib/firebase/products";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types/product";
import { Skeleton } from "@/components/ui/skeleton";

export default function WishlistPage() {
  const { items } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    getProductsByIds(items.map((i) => i.productId))
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [items]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Heart className="h-6 w-6 text-primary fill-primary" /> My Wishlist
        {items.length > 0 && (
          <span className="text-base text-muted-foreground font-normal">({items.length})</span>
        )}
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="font-semibold text-lg">Your wishlist is empty</p>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Save products you love for later
          </p>
          <Button asChild>
            <Link href="/products"><ShoppingBag className="h-4 w-4 mr-2" />Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
