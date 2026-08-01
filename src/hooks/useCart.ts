"use client";

import { useCartStore } from "@/store/cartStore";
import type { CartItem } from "@/lib/types/cart";

export function useCart() {
  const store = useCartStore();

  return {
    items: store.items,
    isOpen: store.isOpen,
    itemCount: store.getItemCount(),
    subtotal: store.getSubtotal(),
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,
    isInCart: store.isInCart,
  };
}
