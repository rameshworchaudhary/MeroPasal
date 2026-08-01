export type CouponType = "percentage" | "fixed";

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: CouponType;
  value: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableCategories?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CouponFormInput {
  code: string;
  description: string;
  type: CouponType;
  value: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  perUserLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableCategories?: string[];
}

export interface CouponValidationResult {
  valid: boolean;
  message?: string;
  discountAmount?: number;
  coupon?: Coupon;
}
