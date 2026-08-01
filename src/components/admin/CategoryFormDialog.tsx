"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import ImageUploader from "@/components/admin/ImageUploader";
import { slugify } from "@/lib/utils";
import { createCategory, updateCategory } from "@/lib/firebase/categories";
import type { Category } from "@/lib/types/category";
import { toast } from "sonner";

const subCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name required"),
  slug: z.string().min(1),
});

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().default(0),
  subCategories: z.array(subCategorySchema),
});

type CategoryFormSchema = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Category;
  onSaved: () => void;
}

export default function CategoryFormDialog({
  open, onOpenChange, initialData, onSaved,
}: CategoryFormDialogProps) {
  const isEdit = !!initialData;
  const [image, setImage] = useState(initialData?.image || "");
  const [submitting, setSubmitting] = useState(false);

  const {
    register, handleSubmit, control, watch, setValue, formState: { errors }, reset,
  } = useForm<CategoryFormSchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      icon: initialData?.icon || "",
      isActive: initialData?.isActive ?? true,
      displayOrder: initialData?.displayOrder ?? 0,
      subCategories: initialData?.subCategories || [],
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
        icon: initialData?.icon || "",
        isActive: initialData?.isActive ?? true,
        displayOrder: initialData?.displayOrder ?? 0,
        subCategories: initialData?.subCategories || [],
      });
      setImage(initialData?.image || "");
    }
  }, [open, initialData, reset]);

  const { fields, append, remove } = useFieldArray({ control, name: "subCategories" });

  const nameValue = watch("name");
  const handleNameBlur = () => {
    if (!isEdit && nameValue && !watch("slug")) {
      setValue("slug", slugify(nameValue));
    }
  };

  const onSubmit = async (data: CategoryFormSchema) => {
    if (!image) {
      toast.error("Please upload a category image");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        image,
        isActive: data.isActive,
        displayOrder: data.displayOrder,
        subCategories: data.subCategories.map((s) => ({
          ...s,
          slug: s.slug || slugify(s.name),
        })),
      };

      if (isEdit && initialData) {
        await updateCategory(initialData.id, payload);
        toast.success("Category updated!");
      } else {
        await createCategory(payload);
        toast.success("Category created!");
      }
      onOpenChange(false);
      onSaved();
    } catch {
      toast.error("Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Add New Category"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Category Name *</Label>
            <Input id="name" {...register("name")} onBlur={handleNameBlur} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">URL Slug *</Label>
            <Input id="slug" {...register("slug")} />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={2} {...register("description")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="icon">Icon (emoji)</Label>
            <Input id="icon" placeholder="📱" {...register("icon")} />
          </div>

          <div className="space-y-1.5">
            <Label>Category Image *</Label>
            <ImageUploader
              images={image ? [image] : []}
              onChange={(imgs) => setImage(imgs[0] || "")}
              folder="categories"
              maxImages={1}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input id="displayOrder" type="number" {...register("displayOrder")} />
          </div>

          {/* Subcategories */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Sub-categories</Label>
              <Button
                type="button" size="sm" variant="outline"
                onClick={() => append({ id: `sub_${Date.now()}`, name: "", slug: "" })}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input placeholder="Sub-category name" {...register(`subCategories.${index}.name`)} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive" className="cursor-pointer">Active (visible in store)</Label>
            <Switch id="isActive" checked={watch("isActive")} onCheckedChange={(v) => setValue("isActive", v)} />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {submitting ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
