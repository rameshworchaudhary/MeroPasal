export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  icon?: string;
  subCategories: SubCategory[];
  productCount: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormInput {
  name: string;
  slug: string;
  description?: string;
  image: string;
  icon?: string;
  subCategories: SubCategory[];
  isActive: boolean;
  displayOrder: number;
}
