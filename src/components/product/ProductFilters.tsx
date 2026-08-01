"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { Category } from "@/lib/types/category";

interface ProductFiltersProps {
  categories: Category[];
  brands: string[];
  maxPrice: number;
  onClose?: () => void;
}

export default function ProductFilters({ categories, brands, maxPrice, onClose }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("categoryId") || "";
  const selectedBrands = searchParams.getAll("brand");
  const minPriceParam = Number(searchParams.get("minPrice") || 0);
  const maxPriceParam = Number(searchParams.get("maxPrice") || maxPrice);
  const selectedRating = Number(searchParams.get("rating") || 0);
  const inStockOnly = searchParams.get("inStock") === "true";
  const [priceRange, setPriceRange] = React.useState<[number, number]>([minPriceParam, maxPriceParam || maxPrice]);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) params.delete(key);
    else params.set(key, value);
    params.delete("page");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const toggleBrand = (brand: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const existing = params.getAll("brand");
    if (existing.includes(brand)) {
      params.delete("brand");
      existing.filter((b) => b !== brand).forEach((b) => params.append("brand", b));
    } else {
      params.append("brand", brand);
    }
    params.delete("page");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const applyPriceRange = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", String(priceRange[0]));
    params.set("maxPrice", String(priceRange[1]));
    params.delete("page");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    const sortBy = searchParams.get("sortBy");
    if (sortBy) params.set("sortBy", sortBy);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const hasActiveFilters = selectedCategory || selectedBrands.length > 0 || selectedRating > 0 || inStockOnly || minPriceParam > 0 || maxPriceParam < maxPrice;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl tracking-wide text-[#292722]">Refine selection</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && <button onClick={clearAllFilters} className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8b6b35] hover:text-[#292722]">Clear all</button>}
          {onClose && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}><X className="h-4 w-4" /></Button>}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5">
          {selectedCategory && <Badge className="gap-1 border-[#d4b982] bg-[#f1ebe1] text-xs text-[#6f542b]">{categories.find((c) => c.id === selectedCategory)?.name || "Category"}<button onClick={() => updateParam("categoryId", null)}><X className="h-3 w-3" /></button></Badge>}
          {selectedBrands.map((b) => <Badge key={b} className="gap-1 border-[#d4b982] bg-[#f1ebe1] text-xs text-[#6f542b]">{b}<button onClick={() => toggleBrand(b)}><X className="h-3 w-3" /></button></Badge>)}
          {selectedRating > 0 && <Badge className="gap-1 border-[#d4b982] bg-[#f1ebe1] text-xs text-[#6f542b]">{selectedRating}+ Stars<button onClick={() => updateParam("rating", null)}><X className="h-3 w-3" /></button></Badge>}
          {inStockOnly && <Badge className="gap-1 border-[#d4b982] bg-[#f1ebe1] text-xs text-[#6f542b]">In Stock<button onClick={() => updateParam("inStock", null)}><X className="h-3 w-3" /></button></Badge>}
        </div>
      )}

      <Separator />
      {categories.length > 0 && (
        <div>
          <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b6b35]">Category</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-3 py-1.5 min-h-[44px]">
              <Checkbox id="cat-all" checked={!selectedCategory} onCheckedChange={() => updateParam("categoryId", null)} />
              <Label htmlFor="cat-all" className="cursor-pointer text-sm font-medium text-[#514c43] flex-1 py-2">All Categories</Label>
            </div>
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 py-1.5 min-h-[44px]">
                <Checkbox id={`cat-${cat.id}`} checked={selectedCategory === cat.id} onCheckedChange={() => updateParam("categoryId", selectedCategory === cat.id ? null : cat.id)} />
                <Label htmlFor={`cat-${cat.id}`} className="flex w-full cursor-pointer items-center justify-between text-sm font-medium text-[#514c43] py-2">
                  <span>{cat.name}</span>
                  {cat.productCount > 0 && <span className="text-xs text-[#9a9388]">({cat.productCount})</span>}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />
      <div>
        <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b6b35]">Price Range</h4>
        <div className="mb-3 flex items-center justify-between text-xs text-[#777166]"><span>{formatCurrency(priceRange[0])}</span><span>{formatCurrency(priceRange[1])}</span></div>
        <input type="range" min={0} max={maxPrice} value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full h-2 accent-[#8b6b35] cursor-pointer" />
        <Button size="sm" variant="outline" className="mt-4 min-h-[44px] w-full rounded-full border-[#cfc5b7] text-xs font-semibold uppercase tracking-wider text-[#514c43] hover:border-[#b99558] hover:bg-[#f1ebe1]" onClick={applyPriceRange}>Apply Price Filter</Button>
      </div>

      <Separator />
      {brands.length > 0 && (
        <div>
          <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b6b35]">Brand</h4>
          <div className="max-h-52 space-y-1 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center gap-3 py-1.5 min-h-[44px]">
                <Checkbox id={`brand-${brand}`} checked={selectedBrands.includes(brand)} onCheckedChange={() => toggleBrand(brand)} />
                <Label htmlFor={`brand-${brand}`} className="cursor-pointer text-sm font-medium text-[#514c43] flex-1 py-2">{brand}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
      {brands.length > 0 && <Separator />}

      <div>
        <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b6b35]">Minimum Rating</h4>
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => updateParam("rating", selectedRating === rating ? null : String(rating))}
              className={`flex min-h-[44px] w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                selectedRating === rating ? "bg-[#f1ebe1] text-[#8b6b35] font-semibold" : "text-[#514c43] hover:bg-[#f1ebe1]"
              }`}
            >
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-4 w-4 ${s <= rating ? "fill-[#c6a56a] text-[#c6a56a]" : "fill-[#f0ebe2] text-[#d8d0c4]"}`} />
                ))}
              </div>
              <span>& above</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />
      <div>
        <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b6b35]">Availability</h4>
        <div className="flex items-center gap-2"><Checkbox id="in-stock" checked={inStockOnly} onCheckedChange={(checked) => updateParam("inStock", checked ? "true" : null)} /><Label htmlFor="in-stock" className="cursor-pointer text-sm text-[#514c43]">In Stock Only</Label></div>
      </div>
    </div>
  );
}