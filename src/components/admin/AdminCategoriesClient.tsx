"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import CategoryFormDialog from "@/components/admin/CategoryFormDialog";
import { deleteCategory } from "@/lib/firebase/categories";
import type { Category } from "@/lib/types/category";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AdminCategoriesClientProps {
  initialCategories: Category[];
}

export default function AdminCategoriesClient({ initialCategories }: AdminCategoriesClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const handleEdit = (cat: Category) => {
    setEditing(cat);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      toast.success("Category deleted");
      setDeleteTarget(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">{initialCategories.length} categories</p>
        </div>
        <Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2" /> Add Category</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialCategories.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted border flex-shrink-0">
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-2xl">{cat.icon || "🛍️"}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{cat.name}</p>
                    <Badge variant={cat.isActive ? "success" : "outline"} className="text-xs">
                      {cat.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.productCount} products</p>
                  {cat.subCategories.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {cat.subCategories.length} sub-categories
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={() => handleEdit(cat)}>
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button
                  size="sm" variant="outline"
                  className="flex-1 h-7 text-xs text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(cat)}
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editing}
        onSaved={() => router.refresh()}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-bold text-lg">Delete Category?</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete "{deleteTarget.name}"? Products in this category will not be deleted but may become unreachable via category navigation.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
