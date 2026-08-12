"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { toggleWishlistItem } from "@/lib/firebase/users";
import { useAuth } from "./useAuth";
import type { WishlistItem } from "@/lib/types/cart";

export function useIsInWishlist(productId: string) {
  return useWishlistStore((state) => state.items.some((i) => i.productId === productId));
}

export function useWishlist() {
  const store = useWishlistStore();
  const { user } = useAuth();

  const toggleItem = async (item: Omit<WishlistItem, "addedAt">) => {
    // Optimistically update local store
    store.toggleItem(item);

    // Sync to Firestore if logged in
    if (user) {
      try {
        await toggleWishlistItem(user.uid, item.productId);
      } catch (err) {
        // Revert optimistic update on error
        store.toggleItem(item);
        console.error("Failed to sync wishlist to Firestore:", err);
      }
    }
  };

  return {
    items: store.items,
    count: store.getCount(),
    isInWishlist: store.isInWishlist,
    toggleItem,
    removeItem: store.removeItem,
    clearWishlist: store.clearWishlist,
  };
}
