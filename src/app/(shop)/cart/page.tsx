"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { formatCurrency, calculateDiscount } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount, clearCart } = useCart();

  const savings = items.reduce((acc, item) => {
    if (item.comparePrice && item.comparePrice > item.price) {
      acc += (item.comparePrice - item.price) * item.quantity;
    }
    return acc;
  }, 0);

  const estimatedShipping = subtotal >= 5000 ? 0 : 150;

  return (
    <div className="container mx-auto px-3.5 py-6 sm:px-6 sm:py-8">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          Shopping Cart
          {itemCount > 0 && (
            <span className="text-sm sm:text-base text-muted-foreground font-normal">({itemCount} items)</span>
          )}
        </h1>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearCart} className="min-h-[44px] text-xs sm:text-sm text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-muted flex items-center justify-center mb-5">
            <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground mb-6">Add some amazing products to get started!</p>
          <Button size="lg" className="min-h-[44px]" asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3.5 sm:space-y-4">
            <AnimatePresence>
              {items.map((item) => {
                const discount = item.comparePrice ? calculateDiscount(item.comparePrice, item.price) : 0;
                return (
                  <motion.div
                    key={`${item.productId}-${JSON.stringify(item.variant)}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex flex-col xs:flex-row gap-3.5 p-3.5 sm:p-4 bg-card rounded-xl border shadow-sm"
                  >
                    <Link href={`/products/${item.slug}`} className="flex-shrink-0 self-start">
                      <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-lg overflow-hidden bg-muted border">
                        <Image src={item.image || "/images/placeholder.jpg"} alt={item.name} fill className="object-cover" sizes="96px" />
                        {discount > 0 && (
                          <span className="absolute top-1 left-1 bg-primary text-white text-[10px] px-1 rounded font-bold">-{discount}%</span>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link href={`/products/${item.slug}`}>
                          <p className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors">{item.name}</p>
                        </Link>
                        {item.variant && Object.keys(item.variant).length > 0 && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(", ")}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-primary text-sm sm:text-base">{formatCurrency(item.price)}</span>
                          {item.comparePrice && item.comparePrice > item.price && (
                            <span className="text-xs text-muted-foreground line-through">{formatCurrency(item.comparePrice)}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t sm:border-t-0">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <button className="px-3 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50" onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variant)} disabled={item.quantity <= 1}>
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-3 py-2 text-sm font-semibold min-w-[2.5rem] text-center">{item.quantity}</span>
                          <button className="px-3 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50" onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variant)} disabled={item.quantity >= item.stock}>
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm sm:text-base">{formatCurrency(item.price * item.quantity)}</span>
                          <button className="h-10 w-10 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors" onClick={() => removeItem(item.productId, item.variant)} aria-label="Remove item">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="min-h-[44px] w-full sm:w-auto" asChild>
                <Link href="/products">← Continue Shopping</Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border shadow-sm p-5 sticky top-24 space-y-4">
              <h2 className="font-bold text-lg">Order Summary</h2>
              <Separator />

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>You save</span>
                    <span className="font-medium">-{formatCurrency(savings)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={estimatedShipping === 0 ? "text-green-600 font-medium" : ""}>
                    {estimatedShipping === 0 ? "FREE" : formatCurrency(estimatedShipping)}
                  </span>
                </div>
                {subtotal < 5000 && (
                  <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
                    Add {formatCurrency(5000 - subtotal)} more for FREE shipping!
                  </p>
                )}
              </div>

              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(subtotal + estimatedShipping)}</span>
              </div>

              <Button size="lg" className="w-full gap-2" asChild>
                <Link href="/checkout">
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <div className="text-center text-xs text-muted-foreground space-y-1">
                <p>🔒 Secure Checkout</p>
                <p>Accepted: eSewa • Khalti</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
