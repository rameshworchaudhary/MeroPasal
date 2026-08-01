import type { DeliveryAddress } from "./nepal-address";

export type UserRole = "customer" | "admin" | "seller";

export interface RecentlyViewedItem {
  productId: string;
  viewedAt: string;
}

export interface SellerProfile {
  shopName: string;
  shopDescription: string;
  shopLogo?: string;
  shopBanner?: string;
  phone: string;
  address: string;
  isApproved: boolean;
  isActive: boolean;
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  rating: number;
  reviewCount: number;
  commissionRate: number; // percentage admin charges
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  photoURL?: string;
  role: UserRole;
  addresses: DeliveryAddress[];
  wishlist: string[];
  recentlyViewed: RecentlyViewedItem[];
  isActive: boolean;
  sellerProfile?: SellerProfile;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileInput {
  displayName?: string;
  phone?: string;
  photoURL?: string;
}