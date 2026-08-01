"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, Users,
  Tag, Image as ImageIcon, Truck, BarChart3, LogOut, Store,
  Home, Menu, X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/firebase/auth";
import { getInitials, cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/sellers", label: "Sellers", icon: Store },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/shipping", label: "Shipping Zones", icon: Truck },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out successfully!");
      router.push("/");
    } catch {
      toast.error("Failed to logout");
      setLoggingOut(false);
    }
  };

  const SidebarInner = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="p-5 border-b border-gray-800 flex-shrink-0">
        <Link
          href="/admin"
          className="flex items-center gap-2"
          onClick={() => setMobileOpen(false)}
        >
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <p className="font-bold text-white text-base leading-none">Kinyo</p>
            <p className="text-xs text-gray-500 leading-none mt-1">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
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
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="flex-shrink-0 border-t border-gray-800">
        {/* View Store only */}
        <div className="p-3">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Home className="h-4 w-4 flex-shrink-0" />
            View Store
          </Link>
        </div>

        {/* User info + Logout */}
        <div className="p-3 border-t border-gray-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={profile?.photoURL || ""} />
              <AvatarFallback className="bg-primary text-white text-xs font-bold">
                {getInitials(profile?.displayName || "A")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {profile?.displayName || "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 flex-col h-screen sticky top-0 flex-shrink-0 text-slate-100 border-r border-slate-800">
        <SidebarInner />
      </aside>

      {/* Mobile Top Navigation Header */}
      <div className="lg:hidden sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 text-white shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 font-extrabold text-xs text-white">
              K
            </div>
            <span className="font-bold text-sm text-white tracking-wide">Kinbey Admin</span>
          </Link>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-lg bg-blue-600/20 px-2.5 py-1.5 text-xs font-bold text-blue-400 hover:bg-blue-600 hover:text-white transition-colors border border-blue-500/30"
        >
          <Home className="h-3.5 w-3.5" />
          <span>View Store</span>
        </Link>
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 z-50 w-72 bg-slate-900 h-full shadow-2xl flex flex-col border-r border-slate-800">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-white text-sm">
                  K
                </div>
                <div>
                  <p className="font-extrabold text-white text-sm">Kinbey Nepal</p>
                  <p className="text-[10px] text-blue-400 font-bold uppercase">Admin Panel</p>
                </div>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarInner />
          </aside>
        </>
      )}
    </>
  );
}