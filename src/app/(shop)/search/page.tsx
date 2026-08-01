import type { Metadata } from "next";
import { Suspense } from "react";
import { Search } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import { getProducts } from "@/lib/firebase/products";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; sortBy?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: "${q}" - Kinyo` : "Search - Kinyo",
    description: `Search results for ${q} on Kinyo`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, sortBy } = await searchParams;

  const { products } = await getProducts({
    search: q,
    sortBy: (sortBy as "newest" | "price-asc" | "price-desc" | "rating" | "popular") || "newest",
  }, 24);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-2xl font-bold">
            {q ? `Results for "${q}"` : "Search Products"}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? "product" : "products"} found
          {q && ` for "${q}"`}
        </p>
      </div>

      {/* Sort options */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {[
          { label: "Newest", value: "newest" },
          { label: "Popular", value: "popular" },
          { label: "Price: Low to High", value: "price-asc" },
          { label: "Price: High to Low", value: "price-desc" },
          { label: "Top Rated", value: "rating" },
        ].map((opt) => (
          <a
            key={opt.value}
            href={`/search?q=${encodeURIComponent(q || "")}&sortBy=${opt.value}`}
            className={`whitespace-nowrap text-xs px-4 py-1.5 rounded-full border transition-colors ${
              (sortBy || "newest") === opt.value
                ? "bg-primary text-white border-primary"
                : "hover:border-primary hover:text-primary"
            }`}
          >
            {opt.label}
          </a>
        ))}
      </div>

      <ProductGrid
        products={products}
        emptyMessage={q ? `No products found for "${q}"` : "Enter a search term to find products"}
      />
    </div>
  );
}
