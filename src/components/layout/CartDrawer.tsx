"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { formatCurrency, calculateDiscount } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 z-50 h-full w-full sm:max-w-md bg-background shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-lg">My Cart</h2>
                {itemCount > 0 && (
                  <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    {itemCount}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 min-h-[44px] min-w-[44px]" onClick={closeCart}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add some products to get started
                    </p>
                  </div>
                  <Button onClick={closeCart} asChild>
                    <Link href="/products">Shop Now</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const discount = item.comparePrice
                      ? calculateDiscount(item.comparePrice, item.price)
                      : 0;
                    return (
                      <div
                        key={`${item.productId}-${JSON.stringify(item.variant)}`}
                        className="flex gap-3 py-3 border-b last:border-0"
                      >
                        {/* Image */}
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="flex-shrink-0"
                        >
                          <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted border">
                            <Image
                              src={item.image || "/images/placeholder.jpg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                            {discount > 0 && (
                              <span className="absolute top-1 left-1 bg-primary text-white text-[10px] px-1 rounded font-bold">
                                -{discount}%
                              </span>
                            )}
                          </div>
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={closeCart}
                          >
                            <p className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors">
                              {item.name}
                            </p>
                          </Link>

                          {/* Variant */}
                          {item.variant && Object.keys(item.variant).length > 0 && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {Object.entries(item.variant)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(", ")}
                            </p>
                          )}

                          {/* Price */}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-semibold text-sm text-primary">
                              {formatCurrency(item.price)}
                            </span>
                            {item.comparePrice && item.comparePrice > item.price && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatCurrency(item.comparePrice)}
                              </span>
                            )}
                          </div>

                          {/* Quantity controls + remove */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border rounded-lg overflow-hidden">
                              <button
                                className="px-2 py-1 hover:bg-muted transition-colors disabled:opacity-50"
                                onClick={() =>
                                  updateQuantity(item.productId, item.quantity - 1, item.variant)
                                }
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                className="px-2 py-1 hover:bg-muted transition-colors disabled:opacity-50"
                                onClick={() =>
                                  updateQuantity(item.productId, item.quantity + 1, item.variant)
                                }
                                disabled={item.quantity >= item.stock}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                              onClick={() => removeItem(item.productId, item.variant)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer with totals */}
            {items.length > 0 && (
              <div className="border-t px-5 py-4 space-y-3 bg-muted/30">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Shipping calculated at checkout</span>
                  <span className="text-green-600 font-medium">
                    {subtotal >= 5000 ? "FREE" : `from Rs. 100`}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <span>Estimated Total</span>
                  <span className="text-primary text-lg">{formatCurrency(subtotal)}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Button variant="outline" asChild onClick={closeCart}>
                    <Link href="/cart">View Cart</Link>
                  </Button>
                  <Button asChild onClick={closeCart} className="gap-1">
                    <Link href="/checkout">
                      Checkout <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  Secure checkout with eSewa & Khalti
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
