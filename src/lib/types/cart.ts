export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  comparePrice?: number;
  quantity: number;
  stock: number;
  variant?: Record<string, string>;
  variantComboId?: string;
}

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  comparePrice?: number;
  addedAt: string;
}
