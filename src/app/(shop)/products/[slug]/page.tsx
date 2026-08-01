import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProductBySlug, getSimilarProducts } from "@/lib/firebase/products";
import { getReviewsByProduct, computeReviewSummary } from "@/lib/firebase/reviews";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import ProductSection from "@/components/home/ProductSection";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} - Kinyo`,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.thumbnailImage }],
    },
  };
}

export const revalidate = 60;

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, similar] = await Promise.all([
    getReviewsByProduct(product.id),
    getSimilarProducts(product, 8),
  ]);

  const reviewSummary = computeReviewSummary(reviews);

  return (
    <div className="pb-16">
      <ProductDetailClient
        product={product}
        reviews={reviews}
        reviewSummary={reviewSummary}
      />
      {similar.length > 0 && (
        <ProductSection
          title="Similar Products"
          subtitle="You might also like these"
          products={similar}
          viewAllHref={`/categories/${product.categoryId}`}
        />
      )}
    </div>
  );
}
