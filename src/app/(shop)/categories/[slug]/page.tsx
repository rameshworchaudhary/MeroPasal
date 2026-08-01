import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import { getCategoryBySlug, getActiveCategories } from "@/lib/firebase/categories";
import { getProducts } from "@/lib/firebase/products";
import type { ProductFilters as FiltersType } from "@/lib/types/product";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    subCategoryId?: string;
    brand?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    sortBy?: string;
    inStock?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} - Kinyo`,
    description: category.description || `Shop ${category.name} products on Kinyo`,
  };
}

export const revalidate = 120;

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const filters: FiltersType = {
    categoryId: category.id,
    subCategoryId: sp.subCategoryId,
    brand: sp.brand ? (Array.isArray(sp.brand) ? sp.brand : [sp.brand]) : undefined,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    rating: sp.rating ? Number(sp.rating) : undefined,
    sortBy: (sp.sortBy as FiltersType["sortBy"]) || "newest",
    inStock: sp.inStock === "true",
  };

  const [{ products }, allCategories] = await Promise.all([
    getProducts(filters, 24),
    getActiveCategories(),
  ]);

  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean) as string[])].sort();
  const maxPrice = Math.max(...products.map((p) => p.comparePrice || p.price), 50000);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/categories" className="hover:text-primary transition-colors">Categories</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{category.name}</span>
      </nav>

      {/* Category header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground mt-1 text-sm">{category.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          {products.length} products found
        </p>
      </div>

      {/* Subcategory pills */}
      {category.subCategories && category.subCategories.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          <a
            href={`/categories/${slug}`}
            className={`whitespace-nowrap text-sm px-4 py-1.5 rounded-full border transition-colors ${
              !sp.subCategoryId
                ? "bg-primary text-white border-primary"
                : "hover:border-primary hover:text-primary"
            }`}
          >
            All
          </a>
          {category.subCategories.map((sub) => (
            <a
              key={sub.id}
              href={`/categories/${slug}?subCategoryId=${sub.id}`}
              className={`whitespace-nowrap text-sm px-4 py-1.5 rounded-full border transition-colors ${
                sp.subCategoryId === sub.id
                  ? "bg-primary text-white border-primary"
                  : "hover:border-primary hover:text-primary"
              }`}
            >
              {sub.name}
            </a>
          ))}
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-card rounded-xl border p-5">
            <ProductFilters
              categories={allCategories}
              brands={brands}
              maxPrice={maxPrice}
            />
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          <ProductGrid
            products={products}
            emptyMessage={`No products found in ${category.name}`}
          />
        </div>
      </div>
    </div>
  );
}
