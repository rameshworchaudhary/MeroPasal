"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import ImageUploader from "@/components/admin/ImageUploader";
import { slugify } from "@/lib/utils";
import { createProduct, updateProduct } from "@/lib/firebase/products";
import type { Category } from "@/lib/types/category";
import type { Product, ProductFormInput } from "@/lib/types/product";
import { toast } from "sonner";

const specSchema = z.object({ key: z.string(), value: z.string() });

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDescription: z.string().min(10, "Short description is required").max(200),
  categoryId: z.string().min(1, "Category is required"),
  subCategoryId: z.string().optional(),
  brand: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  comparePrice: z.coerce.number().optional(),
  costPrice: z.coerce.number().optional(),
  sku: z.string().min(2, "SKU is required"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  lowStockThreshold: z.coerce.number().min(0).default(5),
  unit: z.string().optional(),
  weight: z.coerce.number().optional(),
  tagsInput: z.string().optional(),
  specifications: z.array(specSchema),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  isTrending: z.boolean().default(false),
  status: z.enum(["active", "draft", "archived"]).default("active"),
});

type ProductFormSchema = z.infer<typeof productSchema>;

interface ProductFormProps {
  categories: Category[];
  initialData?: Product;
}

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [thumbnailImage, setThumbnailImage] = useState(initialData?.thumbnailImage || "");
  const [submitting, setSubmitting] = useState(false);

  const {
    register, handleSubmit, control, watch, setValue, formState: { errors },
  } = useForm<ProductFormSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      shortDescription: initialData?.shortDescription || "",
      categoryId: initialData?.categoryId || "",
      subCategoryId: initialData?.subCategoryId || "",
      brand: initialData?.brand || "",
      price: initialData?.price || 0,
      comparePrice: initialData?.comparePrice,
      costPrice: initialData?.costPrice,
      sku: initialData?.sku || "",
      stock: initialData?.stock ?? 0,
      lowStockThreshold: initialData?.lowStockThreshold ?? 5,
      unit: initialData?.unit || "piece",
      weight: initialData?.weight,
      tagsInput: initialData?.tags?.join(", ") || "",
      specifications: initialData?.specifications?.length ? initialData.specifications : [{ key: "", value: "" }],
      isFeatured: initialData?.isFeatured ?? false,
      isActive: initialData?.isActive ?? true,
      isTrending: initialData?.isTrending ?? false,
      status: initialData?.status || "active",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "specifications" });

  const selectedCategoryId = watch("categoryId");
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const nameValue = watch("name");

  const handleNameBlur = () => {
    if (!isEdit && nameValue && !watch("slug")) {
      setValue("slug", slugify(nameValue));
    }
  };

  const onSubmit = async (data: ProductFormSchema) => {
    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    setSubmitting(true);
    try {
      const category = categories.find((c) => c.id === data.categoryId);
      const subCategory = category?.subCategories.find((s) => s.id === data.subCategoryId);

      const tags = data.tagsInput
        ? data.tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const specifications = data.specifications.filter((s) => s.key.trim() && s.value.trim());

      const payload: ProductFormInput = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        categoryId: data.categoryId,
        categoryName: category?.name || "",
        subCategoryId: data.subCategoryId || undefined,
        subCategoryName: subCategory?.name,
        brand: data.brand,
        images,
        thumbnailImage: thumbnailImage || images[0],
        price: data.price,
        comparePrice: data.comparePrice,
        costPrice: data.costPrice,
        sku: data.sku,
        stock: data.stock,
        lowStockThreshold: data.lowStockThreshold,
        unit: data.unit,
        weight: data.weight,
        tags,
        specifications,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
        isTrending: data.isTrending,
        status: data.status,
      };

      if (isEdit && initialData) {
        await updateProduct(initialData.id, payload);
        toast.success("Product updated successfully!");
      } else {
        await createProduct(payload);
        toast.success("Product created successfully!");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" {...register("name")} onBlur={handleNameBlur} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input id="slug" {...register("slug")} />
                {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="shortDescription">Short Description *</Label>
                <Textarea id="shortDescription" rows={2} {...register("shortDescription")} />
                {errors.shortDescription && <p className="text-xs text-destructive">{errors.shortDescription.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Full Description *</Label>
                <Textarea id="description" rows={6} {...register("description")} />
                {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" {...register("brand")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tagsInput">Tags (comma separated)</Label>
                <Input id="tagsInput" placeholder="electronics, smartphone, 5g" {...register("tagsInput")} />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader><CardTitle className="text-base">Product Images *</CardTitle></CardHeader>
            <CardContent>
              <ImageUploader
                images={images}
                onChange={setImages}
                thumbnailImage={thumbnailImage}
                onThumbnailChange={setThumbnailImage}
                folder="products"
              />
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Specifications</CardTitle>
              <Button type="button" size="sm" variant="outline" onClick={() => append({ key: "", value: "" })}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Spec
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input placeholder="Key (e.g. RAM)" {...register(`specifications.${index}.key`)} />
                  <Input placeholder="Value (e.g. 8GB)" {...register(`specifications.${index}.value`)} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card>
            <CardHeader><CardTitle className="text-base">Pricing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="price">Selling Price (Rs.) *</Label>
                <Input id="price" type="number" step="0.01" {...register("price")} />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="comparePrice">Compare-at Price (Rs.)</Label>
                <Input id="comparePrice" type="number" step="0.01" {...register("comparePrice")} />
                <p className="text-xs text-muted-foreground">Shows as strikethrough price</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="costPrice">Cost Price (Rs.)</Label>
                <Input id="costPrice" type="number" step="0.01" {...register("costPrice")} />
                <p className="text-xs text-muted-foreground">For internal profit tracking</p>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader><CardTitle className="text-base">Inventory</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="sku">SKU *</Label>
                <Input id="sku" {...register("sku")} />
                {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input id="stock" type="number" {...register("stock")} />
                {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
                <Input id="lowStockThreshold" type="number" {...register("lowStockThreshold")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="unit">Unit</Label>
                <Input id="unit" placeholder="piece, kg, set" {...register("unit")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" step="0.01" {...register("weight")} />
              </div>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card>
            <CardHeader><CardTitle className="text-base">Organization</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Select value={watch("categoryId")} onValueChange={(v) => { setValue("categoryId", v); setValue("subCategoryId", ""); }}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
              </div>

              {selectedCategory && selectedCategory.subCategories.length > 0 && (
                <div className="space-y-1.5">
                  <Label>Sub-category</Label>
                  <Select value={watch("subCategoryId")} onValueChange={(v) => setValue("subCategoryId", v)}>
                    <SelectTrigger><SelectValue placeholder="Select sub-category" /></SelectTrigger>
                    <SelectContent>
                      {selectedCategory.subCategories.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={watch("status")} onValueChange={(v) => setValue("status", v as "active" | "draft" | "archived")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Visibility toggles */}
          <Card>
            <CardHeader><CardTitle className="text-base">Visibility</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive" className="cursor-pointer">Active (visible in store)</Label>
                <Switch id="isActive" checked={watch("isActive")} onCheckedChange={(v) => setValue("isActive", v)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured" className="cursor-pointer">Featured Product</Label>
                <Switch id="isFeatured" checked={watch("isFeatured")} onCheckedChange={(v) => setValue("isFeatured", v)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isTrending" className="cursor-pointer">Trending Product</Label>
                <Switch id="isTrending" checked={watch("isTrending")} onCheckedChange={(v) => setValue("isTrending", v)} />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {submitting ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </div>
    </form>
  );
}
