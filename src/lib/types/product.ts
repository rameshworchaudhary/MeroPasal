export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

export interface ProductVariantCombo {
  id: string;
  combination: Record<string, string>;
  price: number;
  stock: number;
  sku: string;
  image?: string;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  categoryName: string;
  subCategoryId?: string;
  subCategoryName?: string;
  brand?: string;
  images: string[];
  thumbnailImage: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  unit?: string;
  tags: string[];
  specifications: ProductSpecification[];
  variants?: ProductVariant[];
  variantCombos?: ProductVariantCombo[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  viewCount: number;
  isFeatured: boolean;
  isBestSeller?: boolean;
  isActive: boolean;
  isTrending: boolean;
  weight?: number;
  discountPercentage?: number;
  freeDelivery?: boolean;
  status: "active" | "draft" | "archived";
  sellerId?: string;
  sellerName?: string;
  isSellerProduct?: boolean;
  isAdminApproved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormInput {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  subCategoryId?: string;
  brand?: string;
  images: string[];
  thumbnailImage: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  unit?: string;
  tags: string[];
  specifications: ProductSpecification[];
  isFeatured: boolean;
  isActive: boolean;
  isTrending: boolean;
  weight?: number;
  discountPercentage?: number;
  freeDelivery?: boolean;
  status: "active" | "draft" | "archived";
  categoryName: string;
  subCategoryName?: string;
  sellerId?: string;
  sellerName?: string;
  isSellerProduct?: boolean;
  isAdminApproved?: boolean;
}

export interface ProductFilters {
  categoryId?: string;
  subCategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string[];
  rating?: number;
  tags?: string[];
  sortBy?: "newest" | "price-asc" | "price-desc" | "rating" | "popular";
  search?: string;
  inStock?: boolean;
}