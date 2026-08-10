import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/firebase/products";
import type { ProductFilters } from "@/lib/types/product";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
    
    const categoryId = searchParams.get("categoryId") || undefined;
    const subCategoryId = searchParams.get("subCategoryId") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const rating = searchParams.get("rating") ? Number(searchParams.get("rating")) : undefined;
    const sortBy = (searchParams.get("sortBy") as ProductFilters["sortBy"]) || "newest";
    const search = searchParams.get("q") || searchParams.get("search") || undefined;
    const inStock = searchParams.get("inStock") === "true";
    
    const brandParam = searchParams.get("brand");
    const brand = brandParam ? brandParam.split(",").filter(Boolean) : undefined;

    const filters: ProductFilters = {
      categoryId,
      subCategoryId,
      minPrice,
      maxPrice,
      rating,
      sortBy,
      search,
      inStock,
      brand,
    };

    const { products, total, hasMore } = await getProducts(filters, pageSize, page);

    // Strip out heavy descriptions/specs to keep API payload ultra-light
    const leanProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      price: p.price,
      comparePrice: p.comparePrice,
      discountPercentage: p.discountPercentage,
      thumbnailImage: p.thumbnailImage,
      rating: p.rating,
      reviewCount: p.reviewCount,
      stock: p.stock,
      unit: p.unit,
      categoryId: p.categoryId,
      categoryName: p.categoryName,
      brand: p.brand,
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller,
      isTrending: p.isTrending,
      freeDelivery: p.freeDelivery,
      sellerName: p.sellerName,
    }));

    return NextResponse.json({
      products: leanProducts,
      total,
      page,
      hasMore,
    });
  } catch (error) {
    console.error("Error in GET /api/products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
