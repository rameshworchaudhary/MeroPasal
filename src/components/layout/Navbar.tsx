"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Package,
  LogOut,
  MapPin,
  LayoutDashboard,
  Store,
  Sparkles,
  Bell,
  Mic,
  Camera,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { logout } from "@/lib/firebase/auth";
import { getInitials } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { SITE_CONFIG } from "@/lib/constants/site";
import { toast } from "sonner";
import type { Category } from "@/lib/types/category";
import VoiceSearchModal from "@/components/common/VoiceSearchModal";
import ImageSearchModal from "@/components/common/ImageSearchModal";

interface NavbarProps {
  categories?: Category[];
}

export default function Navbar({ categories = [] }: NavbarProps) {
  const router = useRouter();
  const { user, profile, isAdmin } = useAuth();
  const { itemCount, toggleCart } = useCart();
  const { count: wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // AI Modal States
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(debouncedSearch.trim())}`);
    }
  }, [debouncedSearch, router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      {/* Voice & Image Search Modals */}
      <VoiceSearchModal isOpen={voiceModalOpen} onClose={() => setVoiceModalOpen(false)} />
      <ImageSearchModal isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} />

      {/* Top Announcement & Service Bar */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-3 sm:px-6 py-2 text-center text-[10px] sm:text-[11px] font-medium tracking-wider text-slate-300">
        <div className="container mx-auto flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 sm:gap-4 mx-auto sm:mx-0">
            <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>Nepal Express Delivery (All 77 Districts)</span>
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:flex items-center gap-1 text-amber-300 font-semibold">
              <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>Free Shipping on Orders &gt; Rs. 5,000</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-slate-400">
            <Link href="/seller/register" className="hover:text-amber-400 flex items-center gap-1 transition-colors">
              <Store className="h-3.5 w-3.5 text-amber-400" /> Become a Seller
            </Link>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 100% Genuine Guarantee
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-blue-300 font-bold">Support: +977 9742491352</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl transition-shadow duration-300 ${
          scrolled ? "shadow-2xl shadow-blue-950/30" : ""
        }`}
      >
        <div className="container mx-auto px-3 sm:px-6">
          <div className="flex min-h-[4rem] sm:min-h-[4.75rem] items-center justify-between gap-3 sm:gap-6">
            {/* Logo + Tagline */}
            <Link href="/" className="group flex-shrink-0" aria-label="Kinbey Home">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-600/30 transition-transform duration-300 group-hover:scale-105">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif">
                      Kinbey
                    </span>
                    <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-amber-300 border border-amber-400/30">
                      NEPAL
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] font-medium text-slate-300 tracking-wide font-sans">
                    Sabai kura, ekai thau ma
                  </p>
                </div>
              </div>
            </Link>

            {/* Mega Menu Trigger - Desktop */}
            <div className="hidden lg:block relative">
              <button
                className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs font-bold tracking-wide text-slate-200 transition-all hover:border-blue-500 hover:bg-slate-900 hover:text-white"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
                onClick={() => setMegaMenuOpen((v) => !v)}
              >
                <Menu className="h-4 w-4 text-blue-400" />
                <span>Categories</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform ${megaMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-80 rounded-2xl border border-slate-800 bg-slate-900/98 p-3 shadow-2xl shadow-black/90 backdrop-blur-2xl"
                    onMouseEnter={() => setMegaMenuOpen(true)}
                    onMouseLeave={() => setMegaMenuOpen(false)}
                  >
                    <div className="space-y-1">
                      {categories.slice(0, 10).map((cat) => (
                        <Link
                          key={cat.id || cat.slug}
                          href={`/categories/${cat.slug}`}
                          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-blue-600/20 hover:text-white"
                          onClick={() => setMegaMenuOpen(false)}
                        >
                          <span className="text-base">{cat.icon || "🛍️"}</span>
                          <span>{cat.name}</span>
                          {cat.productCount > 0 && (
                            <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                              {cat.productCount}
                            </span>
                          )}
                        </Link>
                      ))}
                      <div className="mt-2 border-t border-slate-800 pt-2 px-2">
                        <Link
                          href="/categories"
                          className="block text-center text-xs font-bold text-blue-400 hover:text-blue-300 py-1"
                          onClick={() => setMegaMenuOpen(false)}
                        >
                          Explore All Categories &rarr;
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Bar - Desktop & Tablet with Voice + Image Search */}
            <form onSubmit={handleSearchSubmit} className="hidden max-w-xl flex-1 md:flex">
              <div className="relative w-full flex items-center">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search for Products, Brands and More"
                  className="h-11 rounded-2xl border border-slate-800 bg-slate-900/90 pl-11 pr-24 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:bg-slate-900 focus-visible:ring-2 focus-visible:ring-blue-500/20 shadow-inner"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setVoiceModalOpen(true)}
                    title="Voice Search"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-colors"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageModalOpen(true)}
                    title="Image Search"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-7 rounded-lg bg-blue-600 px-3 text-[11px] font-bold text-white hover:bg-blue-500"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Become Seller Link (Desktop) — goes straight to seller login */}
              <Link
                href="/login?mode=seller"
                className="hidden xl:flex items-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-400/20 hover:border-amber-400 transition-all"
              >
                <Store className="h-3.5 w-3.5 text-amber-400" />
                <span>Sell on Kinbey</span>
              </Link>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-2xl text-slate-300 hover:bg-slate-900 hover:text-white"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-80 bg-slate-900 border-slate-800 text-slate-200 p-3 shadow-2xl backdrop-blur-xl"
                >
                  <DropdownMenuLabel className="font-bold text-xs uppercase text-slate-400 mb-1 flex items-center justify-between">
                    <span>Notifications</span>
                    <span className="text-[10px] text-blue-400 lowercase font-normal">Mark all read</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <div className="space-y-2 py-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <p className="font-bold text-white text-xs">🎉 Welcome to Kinbey Nepal!</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Enjoy free delivery across all 77 districts on orders over Rs. 5,000.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                      <p className="font-semibold text-slate-200 text-xs">⚡ Dashain & Tihar Sale Live</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Up to 60% OFF on top tech & fashion brands.</p>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Wishlist & Cart — hidden on mobile since MobileBottomNav already shows them; visible from md up */}
              <div className="hidden md:flex items-center gap-1.5 sm:gap-2.5">
                {/* Wishlist */}
                <Link href="/wishlist">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-2xl text-slate-300 hover:bg-slate-900 hover:text-white"
                  >
                    <Heart className="h-5 w-5" />
                    {mounted && wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-[10px] text-white flex items-center justify-center font-bold">
                        {wishlistCount > 9 ? "9+" : wishlistCount}
                      </span>
                    )}
                    <span className="sr-only">Wishlist</span>
                  </Button>
                </Link>

                {/* Cart Drawer */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-2xl text-slate-300 hover:bg-slate-900 hover:text-white"
                  onClick={toggleCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {mounted && itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-md shadow-blue-500/20">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Button>
              </div>

              {/* Quick Admin Access Button if Admin */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-xs font-bold transition-all shadow-xs"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl text-slate-300 hover:bg-slate-900">
                      <Avatar className="h-8 w-8 border border-blue-500/40">
                        <AvatarImage src={profile?.photoURL || ""} alt={profile?.displayName || ""} />
                        <AvatarFallback className="bg-blue-600 text-xs font-bold text-white">
                          {getInitials(profile?.displayName || user.email || "U")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-200 shadow-2xl">
                    <DropdownMenuLabel>
                      <p className="font-bold text-white truncate">{profile?.displayName || "User"}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center gap-2 cursor-pointer text-blue-400 hover:text-blue-300">
                            <LayoutDashboard className="h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-800" />
                      </>
                    )}
                    {profile?.role === "seller" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/seller/dashboard" className="flex items-center gap-2 cursor-pointer text-emerald-400 hover:text-emerald-300">
                            <Store className="h-4 w-4" />
                            Seller Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-800" />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="flex items-center gap-2 cursor-pointer">
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist" className="flex items-center gap-2 cursor-pointer">
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem
                      className="text-rose-400 focus:bg-rose-500/10 focus:text-rose-300 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-900 font-semibold" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 shadow-md shadow-blue-600/30" asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-2xl text-slate-300 hover:bg-slate-900 lg:hidden"
                onClick={() => setMobileMenuOpen((v) => !v)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="pb-3 md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Search Kinbey..."
                className="h-10 rounded-2xl border border-slate-800 bg-slate-900/90 pl-10 pr-20 text-xs text-slate-100 placeholder:text-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setVoiceModalOpen(true)}
                  className="p-1 text-slate-400 hover:text-blue-400"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setImageModalOpen(true)}
                  className="p-1 text-slate-400 hover:text-blue-400"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Secondary Navigation Links - Desktop */}
        <div className="hidden border-t border-slate-800/80 bg-slate-950/70 lg:block">
          <div className="container mx-auto px-6">
            <div className="flex h-10 items-center justify-between text-xs font-bold tracking-wide text-slate-300">
              <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-1">
                <Link href="/products?featured=true" className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors">
                  <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>Flash Deals</span>
                </Link>
                {categories.slice(0, 7).map((cat) => (
                  <Link
                    key={cat.id || cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="whitespace-nowrap text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link href="/products?sortBy=newest" className="whitespace-nowrap text-slate-300 hover:text-white transition-colors">
                  New Arrivals
                </Link>
                <Link href="/products?sortBy=popular" className="whitespace-nowrap text-emerald-400 hover:text-emerald-300 transition-colors">
                  🔥 Best Sellers
                </Link>
              </div>

              <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                <span className="flex items-center gap-1 text-slate-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Easy 7-Day Returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-y-0 left-0 z-50 w-[min(22rem,88vw)] overflow-y-auto bg-slate-950 border-r border-slate-800 shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-800 p-5">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <span className="font-extrabold text-xl text-white tracking-tight">{SITE_CONFIG.name}</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {user ? (
              <div className="border-b border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-blue-500/30">
                    <AvatarImage src={profile?.photoURL || ""} />
                    <AvatarFallback className="bg-blue-600 text-sm font-bold text-white">
                      {getInitials(profile?.displayName || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-white truncate">{profile?.displayName}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 border-b border-slate-800 p-5">
                <Button className="flex-1 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/login">Login</Link>
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}

            {profile?.role !== "seller" && (
              <div className="px-5 pt-4">
                <Link
                  href="/login?mode=seller"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-400/20 hover:border-amber-400 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Store className="h-3.5 w-3.5 text-amber-400" />
                  <span>Sell on Kinbey</span>
                </Link>
              </div>
            )}

            <div className="p-5 space-y-6">
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  Categories
                </p>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="flex items-center gap-3 rounded-xl p-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{cat.icon || "🛍️"}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-1 border-t border-slate-800 pt-5">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  Account
                </p>
                {user && (
                  <>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 rounded-xl p-3 text-sm font-bold text-white bg-blue-600/25 border border-blue-500/40 hover:bg-blue-600/35 transition-all mb-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <ShieldCheck className="h-4 w-4 text-blue-400" />
                        <span>Admin Control Dashboard</span>
                      </Link>
                    )}
                    {profile?.role === "seller" && (
                      <Link href="/seller/dashboard" className="flex items-center gap-3 rounded-xl p-2.5 text-sm font-medium text-emerald-400 hover:bg-slate-900" onClick={() => setMobileMenuOpen(false)}>
                        <Store className="h-4 w-4" /> Seller Dashboard
                      </Link>
                    )}
                    <Link href="/profile" className="flex items-center gap-3 rounded-xl p-2.5 text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                      <User className="h-4 w-4" /> My Profile
                    </Link>
                    <Link href="/orders" className="flex items-center gap-3 rounded-xl p-2.5 text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                      <Package className="h-4 w-4" /> My Orders
                    </Link>
                    <Link href="/wishlist" className="flex items-center gap-3 rounded-xl p-2.5 text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                      <Heart className="h-4 w-4" /> Wishlist ({wishlistCount})
                    </Link>
                    <button
                      className="flex w-full items-center gap-3 rounded-xl p-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10"
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}