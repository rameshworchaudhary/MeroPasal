"use client";

import { useEffect } from "react";
import { subscribeToAuthChanges, getUserProfile } from "@/lib/firebase/auth";
import { useAuthStore } from "@/store/authStore";

export function useAuthInitializer() {
  const { setUser, setProfile, setLoading, setInitialized } = useAuthStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setProfile(profile);
        } catch {
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, [setUser, setProfile, setLoading, setInitialized]);
}

export function useAuth() {
  const {
    user, profile, loading, initialized,
    isAdmin, isSeller, isCustomer, isAuthenticated, isApprovedSeller,
  } = useAuthStore();

  return {
    user,
    profile,
    loading,
    initialized,
    isAdmin: isAdmin(),
    isSeller: isSeller(),
    isCustomer: isCustomer(),
    isAuthenticated: isAuthenticated(),
    isApprovedSeller: isApprovedSeller(),
  };
}