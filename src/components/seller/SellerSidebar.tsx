"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart,
  BarChart3, LogOut, Store, Settings, Home,
  Menu, X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/firebase/auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV_ITEMS = [
  { href: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/seller/products", label: "My Products", icon: Package },
  { href: "/seller/orders", label: "My Orders", icon: ShoppingCart },
  { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/seller/settings", label: "Shop Settings", icon: Settings },
];

export default function SellerSidebar() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out!");
      router.push("/");
    } catch {
      toast.error("Logout failed. Try again.");
      setLoggingOut(false);
    }
  };

  const shopName = profile?.sellerProfile?.shopName || "My Shop";
  const isApproved = profile?.sellerProfile?.isApproved;

  const SidebarInner = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#111827",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "20px", borderBottom: "1px solid #1f2937", flexShrink: 0 }}>
        <Link
          href="/seller/dashboard"
          onClick={() => setMobileOpen(false)}
          style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
        >
          <div style={{
            height: 36, width: 36, borderRadius: "50%",
            backgroundColor: "#16a34a",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Store style={{ color: "white", width: 18, height: 18 }} />
          </div>
          <div>
            <p style={{ color: "white", fontWeight: 700, fontSize: 14, margin: 0 }}>{shopName}</p>
            <p style={{ fontSize: 11, margin: "3px 0 0", color: isApproved ? "#4ade80" : "#fbbf24" }}>
              {isApproved ? "✓ Approved" : "⏳ Pending"}
            </p>
          </div>
        </Link>
      </div>

      {/* LOGOUT BUTTON — at the top, always visible */}
      <div style={{ padding: "12px", borderBottom: "1px solid #1f2937", flexShrink: 0 }}>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "10px",
            borderRadius: 8,
            backgroundColor: "#dc2626",
            color: "white",
            fontWeight: 700,
            fontSize: 14,
            border: "none",
            cursor: loggingOut ? "not-allowed" : "pointer",
            opacity: loggingOut ? 0.7 : 1,
          }}
        >
          <LogOut style={{ width: 16, height: 16 }} />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                marginBottom: 4,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                backgroundColor: isActive ? "#16a34a" : "transparent",
                color: isActive ? "white" : "#d1d5db",
              }}
            >
              <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px", borderTop: "1px solid #1f2937", flexShrink: 0 }}>
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            color: "#9ca3af",
          }}
        >
          <Home style={{ width: 16, height: 16 }} />
          View Store
        </Link>

        {/* User info */}
        <div style={{ padding: "8px 12px", marginTop: 4 }}>
          <p style={{ color: "white", fontSize: 12, fontWeight: 600, margin: 0 }}>
            {profile?.displayName || "Seller"}
          </p>
          <p style={{ color: "#6b7280", fontSize: 11, margin: "2px 0 0" }}>
            {profile?.email}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: 256,
          backgroundColor: "#111827",
          height: "100vh",
          position: "sticky",
          top: 0,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
        }}
        className="hidden lg:flex"
      >
        <SidebarInner />
      </aside>

      {/* Mobile Toggle */}
      <button
        className="lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 50,
          height: 40,
          width: 40,
          borderRadius: "50%",
          backgroundColor: "#16a34a",
          color: "white",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        {mobileOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 40,
              backgroundColor: "rgba(0,0,0,0.6)",
            }}
          />
          <aside
            className="lg:hidden"
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              zIndex: 50,
              width: 256,
              height: "100%",
              backgroundColor: "#111827",
              boxShadow: "4px 0 20px rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SidebarInner />
          </aside>
        </>
      )}
    </>
  );
}