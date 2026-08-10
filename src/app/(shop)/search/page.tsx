import type { Metadata } from "next";
import { Search } from "lucide-react";
import ProductGridInfinite from "@/components/product/ProductGridInfinite";
import { getProducts } from "@/lib/firebase/products";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; sortBy?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: "${q}" - NexShop` : "Search - NexShop",
    description: `Search results for ${q} on NexShop`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, sortBy } = await searchParams;

  const filters = {
    search: q,
    sortBy: (sortBy as "newest" | "price-asc" | "price-desc" | "rating" | "popular") || "newest",
  };

  const { products, total, hasMore } = await getProducts(filters, 20, 1);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Search className="h-5 w-5 text-neutral-700" />
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-neutral-900">
            {q ? `Results for "${q}"` : "Search Products"}
          </h1>
        </div>
        <p className="text-sm text-neutral-600">
          {total} {total === 1 ? "product" : "products"} found
          {q && ` for "${q}"`}
        </p>
      </div>

      {/* Sort options */}
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-1">
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
            className={`whitespace-nowrap text-xs px-4 py-2 rounded-full border font-medium transition-colors ${
              (sortBy || "newest") === opt.value
                ? "bg-black text-white border-black"
                : "border-neutral-200 text-neutral-700 hover:border-black hover:text-black"
            }`}
          >
            {opt.label}
          </a>
        ))}
      </div>

      <ProductGridInfinite
        initialProducts={products}
        initialHasMore={hasMore}
        initialTotal={total}
        filters={filters}
        emptyMessage={q ? `No products found for "${q}"` : "Enter a search term to find products"}
      />
    </div>
  );
}
