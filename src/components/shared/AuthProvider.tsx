"use client";

import { useAuthInitializer } from "@/hooks/useAuth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthInitializer();
  return <>{children}</>;
}
