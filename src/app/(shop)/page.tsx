import type { Metadata } from "next";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryBar from "@/components/home/CategoryBar";
import FeatureStrip from "@/components/home/FeatureStrip";
import FlashAndCategories from "@/components/home/FlashAndCategories";
import ProductSection from "@/components/home/ProductSection";
import PromoSection from "@/components/home/PromoSection";
import PopularBrands from "@/components/home/PopularBrands";
import CustomerReviews from "@/components/home/CustomerReviews";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import NepalPaymentBar from "@/components/home/NepalPaymentBar";
import NewsletterSection from "@/components/home/NewsletterSection";
import { getActiveCategories } from "@/lib/firebase/categories";
import { getActiveBannersByPosition } from "@/lib/firebase/banners";
import {
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
} from "@/lib/firebase/products";
import { SITE_CONFIG } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
};

// Revalidate every 5 minutes
export const revalidate = 300;

export default async function HomePage() {
  // Fetch all homepage data in parallel
  const [heroBanners, secondaryBanners, categories, featuredProducts, trendingProducts, newArrivals] =
    await Promise.allSettled([
      getActiveBannersByPosition("hero"),
      getActiveBannersByPosition("secondary"),
      getActiveCategories(),
      getFeaturedProducts(12),
      getTrendingProducts(12),
      getNewArrivals(12),
    ]);

  const hero = heroBanners.status === "fulfilled" ? heroBanners.value : [];
  const secondary = secondaryBanners.status === "fulfilled" ? secondaryBanners.value : [];
  const cats = categories.status === "fulfilled" ? categories.value : [];
  const featured = featuredProducts.status === "fulfilled" ? featuredProducts.value : [];
  const trending = trendingProducts.status === "fulfilled" ? trendingProducts.value : [];
  const arrivals = newArrivals.status === "fulfilled" ? newArrivals.value : [];

  return (
    <div className="pb-10 bg-slate-50 min-h-screen">
      {/* 1. Horizontal Category Navigation Bar */}
      <CategoryBar categories={cats} />

      {/* 2. Hero Section: Compact height banner slider + Side Exchange Offer Card */}
      <HeroBanner banners={hero} />

      {/* 3. Feature Value Proposition Strip */}
      <FeatureStrip />

      {/* 4. Flash Sale + Shop by Category Side-by-Side Grid */}
      <FlashAndCategories products={featured} categories={cats} />

      {/* 5. Trending in Nepal */}
      {trending.length > 0 && (
        <ProductSection
          title="🔥 Trending in Nepal"
          subtitle="Top picks trending across Kathmandu, Pokhara, Chitwan & beyond"
          products={trending}
          viewAllHref="/products?sortBy=popular"
          badge="Nepal Hot"
        />
      )}

      {/* 6. Secondary Promotional Banners */}
      <PromoSection banners={secondary} />

      {/* 7. Best Sellers in Nepal */}
      {featured.length > 0 && (
        <ProductSection
          title="🏆 Best Sellers in Nepal"
          subtitle="Highest rated products with 100% genuine warranty"
          products={featured}
          viewAllHref="/products?featured=true"
          badge="Top Rated"
        />
      )}

      {/* 8. New Arrivals */}
      {arrivals.length > 0 && (
        <ProductSection
          title="✨ New Arrivals"
          subtitle="Fresh products added to NexShop this week"
          products={arrivals}
          viewAllHref="/products?sortBy=newest"
          badge="New"
        />
      )}

      {/* 9. Popular Brands in Nepal */}
      <PopularBrands />

      {/* 10. Verified Customer Feedback */}
      <CustomerReviews />

      {/* 11. Payment Gateways (eSewa & Khalti Only) */}
      <NepalPaymentBar />

      {/* 12. Why Choose NexShop */}
      <WhyChooseUs />

      {/* 13. Newsletter */}
      <NewsletterSection />
    </div>
  );
}
