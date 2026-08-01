"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/admin/DataTable";
import { deleteProduct, updateProduct } from "@/lib/firebase/products";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types/product";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AdminProductsClientProps {
  initialProducts: Product[];
}

export default function AdminProductsClient({ initialProducts }: AdminProductsClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleToggleActive = async (product: Product) => {
    try {
      await updateProduct(product.id, { isActive: !product.isActive });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isActive: !p.isActive } : p))
      );
      toast.success(product.isActive ? "Product hidden from store" : "Product is now visible");
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success("Product deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} total products</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new"><Plus className="h-4 w-4 mr-2" /> Add Product</Link>
        </Button>
      </div>

      <DataTable
        data={filtered}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or SKU..."
        rowKey={(p) => p.id}
        columns={[
          {
            header: "Product",
            accessor: (p) => (
              <div className="flex items-center gap-3 min-w-[220px]">
                <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted border flex-shrink-0">
                  <Image src={p.thumbnailImage || "/images/placeholder.jpg"} alt={p.name} fill className="object-cover" sizes="40px" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium line-clamp-1">{p.name}</p>
                  <p className="text-xs text-muted-foreground">SKU: {p.sku}</p>
                </div>
              </div>
            ),
          },
          { header: "Category", accessor: (p) => <span className="text-muted-foreground">{p.categoryName}</span> },
          { header: "Price", accessor: (p) => <span className="font-medium">{formatCurrency(p.price)}</span> },
          {
            header: "Stock",
            accessor: (p) => (
              <Badge variant={p.stock === 0 ? "destructive" : p.stock <= p.lowStockThreshold ? "warning" : "success"}>
                {p.stock} units
              </Badge>
            ),
          },
          { header: "Sold", accessor: (p) => p.soldCount },
          {
            header: "Status",
            accessor: (p) => (
              <Badge variant={p.isActive ? "success" : "outline"}>
                {p.isActive ? "Active" : "Hidden"}
              </Badge>
            ),
          },
          {
            header: "Actions",
            accessor: (p) => (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleActive(p)} title={p.isActive ? "Hide" : "Show"}>
                  {p.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <Link href={`/admin/products/${p.id}`}><Pencil className="h-4 w-4" /></Link>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(p)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-bold text-lg">Delete Product?</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete "{deleteTarget.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
