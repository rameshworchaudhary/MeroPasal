export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  linkType: "product" | "category" | "url" | "none";
  linkValue?: string;
  buttonText?: string;
  position: "hero" | "secondary" | "sidebar" | "popup";
  displayOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BannerFormInput {
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  linkType: "product" | "category" | "url" | "none";
  linkValue?: string;
  buttonText?: string;
  position: "hero" | "secondary" | "sidebar" | "popup";
  displayOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}
