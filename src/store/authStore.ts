"use client";

import { create } from "zustand";
import type { User } from "firebase/auth";
import type { UserProfile } from "@/lib/types/user";

interface AuthStore {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;

  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;

  // Helpers
  isAdmin: () => boolean;
  isSeller: () => boolean;
  isCustomer: () => boolean;
  isAuthenticated: () => boolean;
  isApprovedSeller: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
  reset: () => set({ user: null, profile: null, loading: false }),

  isAdmin: () => get().profile?.role === "admin",
  isSeller: () => get().profile?.role === "seller",
  isCustomer: () => get().profile?.role === "customer",
  isAuthenticated: () => get().user !== null,
  isApprovedSeller: () =>
    get().profile?.role === "seller" &&
    get().profile?.sellerProfile?.isApproved === true,
}));