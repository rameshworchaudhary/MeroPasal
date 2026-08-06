"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types/cart";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variant?: Record<string, string>) => void;
  updateQuantity: (productId: string, quantity: number, variant?: Record<string, string>) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed helpers (called as functions since Zustand doesn't support computed getters natively)
  getItemCount: () => number;
  getSubtotal: () => number;
  isInCart: (productId: string, variant?: Record<string, string>) => boolean;
}

function itemKey(productId: string, variant?: Record<string, string>): string {
  if (!variant || Object.keys(variant).length === 0) return productId;
  return `${productId}__${Object.entries(variant)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|")}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem: CartItem) => {
        set((state) => {
          const key = itemKey(newItem.productId, newItem.variant);
          const existing = state.items.find(
            (i) => itemKey(i.productId, i.variant) === key
          );

          if (existing) {
            const newQty = Math.min(existing.quantity + newItem.quantity, newItem.stock);
            return {
              items: state.items.map((i) =>
                itemKey(i.productId, i.variant) === key ? { ...i, quantity: newQty } : i
              ),
              isOpen: true,
            };
          }

          return {
            items: [...state.items, { ...newItem, quantity: Math.min(newItem.quantity, newItem.stock) }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId: string, variant?: Record<string, string>) => {
        const key = itemKey(productId, variant);
        set((state) => ({
          items: state.items.filter((i) => itemKey(i.productId, i.variant) !== key),
        }));
      },

      updateQuantity: (productId: string, quantity: number, variant?: Record<string, string>) => {
        const key = itemKey(productId, variant);
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter((i) => itemKey(i.productId, i.variant) !== key),
          }));
          return;
        }
        set((state) => ({
          items: state.items.map((i) => {
            if (itemKey(i.productId, i.variant) !== key) return i;
            return { ...i, quantity: Math.min(quantity, i.stock) };
          }),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      isInCart: (productId: string, variant?: Record<string, string>) => {
        const key = itemKey(productId, variant);
        return get().items.some((i) => itemKey(i.productId, i.variant) === key);
      },
    }),
    {
      name: "NexShop-cart",
      // Only persist items, not UI state
      partialize: (state) => ({ items: state.items }),
    }
  )
);
