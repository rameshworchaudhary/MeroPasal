"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ChevronLeft, Plus, Trash2, Loader2, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { getActiveCategories } from "@/lib/firebase/categories";
import { createProduct } from "@/lib/firebase/products";
import { slugify } from "@/lib/utils";
import { Category } from "@/lib/types/category";
import { toast } from "sonner";
import ImageUploader from "@/components/common/ImageUploader";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDescription: z.string().min(10, "Short description required").max(200),
  categoryId: z.string().min(1, "Category is required"),
  subCategoryId: z.string().optional(),
  brand: z.string().optional(),
  thumbnailImage: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  comparePrice: z.coerce.number().optional(),
  costPrice: z.coerce.number().optional(),
  sku: z.string().min(2, "SKU is required"),
  stock: z.coerce.number().min(0),
  lowStockThreshold: z.coerce.number().min(0).default(5),
  unit: z.string().optional(),
  weight: z.coerce.number().optional(),
  tagsInput: z.string().optional(),
  specifications: z.array(z.object({ key: z.string(), value: z.string() })),
  isFeatured: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productSchema>;

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80";

export default function SellerNewProductPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile && !profile.sellerProfile?.isApproved) {
      router.push("/seller/pending");
      return;
    }
    getActiveCategories().then(setCategories);
  }, [profile, router]);

  const {
    register, handleSubmit, watch, setValue,
    control, formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      specifications: [{ key: "", value: "" }],
      lowStockThreshold: 5,
      unit: "piece",
      stock: 0,
      isFeatured: false,
      thumbnailImage: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "specifications" });
  const nameValue = watch("name");
  const selectedCategoryId = watch("categoryId");
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const thumbnailValue = watch("thumbnailImage");

  const handleNameBlur = () => {
    if (nameValue && !watch("slug")) {
      setValue("slug", slugify(nameValue));
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!user || !profile) return;

    setSubmitting(true);
    try {
      const category = categories.find((c) => c.id === data.categoryId);
      const subCategory = category?.subCategories.find((s) => s.id === data.subCategoryId);
      const tags = data.tagsInput
        ? data.tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
      const specs = data.specifications.filter((s) => s.key.trim() && s.value.trim());
      const imageUrl = data.thumbnailImage?.trim() || PLACEHOLDER_IMAGE;

      await createProduct({
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        categoryId: data.categoryId,
        categoryName: category?.name || "",
        subCategoryId: data.subCategoryId || undefined,
        subCategoryName: subCategory?.name,
        brand: data.brand,
        images: [imageUrl],
        thumbnailImage: imageUrl,
        price: data.price,
        comparePrice: data.comparePrice,
        costPrice: data.costPrice,
        sku: data.sku,
        stock: data.stock,
        lowStockThreshold: data.lowStockThreshold,
        unit: data.unit,
        weight: data.weight,
        tags,
        specifications: specs,
        isFeatured: data.isFeatured,
        isActive: false,
        isTrending: false,
        status: "draft",
        sellerId: user.uid,
        sellerName: profile.sellerProfile?.shopName || profile.displayName,
        isSellerProduct: true,
        isAdminApproved: false,
      });

      toast.success("Product submitted for admin approval!");
      router.push("/seller/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/seller/products" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="text-sm text-muted-foreground">Fill details — admin will review before publishing</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          <strong>Admin Approval Required:</strong> Your product will be reviewed before it appears on the store. Image is optional — you can add it later.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic Info */}
            <Card>
              <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input id="name" placeholder="e.g. Samsung Galaxy A55" {...register("name")} onBlur={handleNameBlur} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input id="slug" placeholder="samsung-galaxy-a55" {...register("slug")} />
                  {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Textarea id="shortDescription" rows={2} placeholder="Brief product summary (max 200 chars)" {...register("shortDescription")} />
                  {errors.shortDescription && <p className="text-xs text-destructive">{errors.shortDescription.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea id="description" rows={5} placeholder="Detailed product description..." {...register("description")} />
                  {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" placeholder="e.g. Samsung" {...register("brand")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="tagsInput">Tags (comma separated)</Label>
                    <Input id="tagsInput" placeholder="phone, android, 5g" {...register("tagsInput")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Product Image Direct Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  value={watch("thumbnailImage")}
                  onChange={(url) => setValue("thumbnailImage", url)}
                  folder="products"
                  label="Upload Primary Product Image"
                  description="Directly upload image to Firebase Storage (PNG, JPG, WEBP up to 5MB)"
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

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* Pricing */}
            <Card>
              <CardHeader><CardTitle className="text-base">Pricing</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Selling Price (Rs.) *</Label>
                  <Input id="price" type="number" step="0.01" placeholder="0" {...register("price")} />
                  {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="comparePrice">Compare Price (Rs.)</Label>
                  <Input id="comparePrice" type="number" step="0.01" placeholder="Strikethrough price" {...register("comparePrice")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="costPrice">Cost Price (Rs.)</Label>
                  <Input id="costPrice" type="number" step="0.01" placeholder="Your cost" {...register("costPrice")} />
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader><CardTitle className="text-base">Inventory</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input id="sku" placeholder="PROD-001" {...register("sku")} />
                  {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input id="stock" type="number" {...register("stock")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
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

            {/* Category */}
            <Card>
              <CardHeader><CardTitle className="text-base">Category *</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select
                    value={watch("categoryId")}
                    onValueChange={(v) => { setValue("categoryId", v); setValue("subCategoryId", ""); }}
                  >
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
                    <Select
                      value={watch("subCategoryId")}
                      onValueChange={(v) => setValue("subCategoryId", v)}
                    >
                      <SelectTrigger><SelectValue placeholder="Select sub-category" /></SelectTrigger>
                      <SelectContent>
                        {selectedCategory.subCategories.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader><CardTitle className="text-base">Options</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isFeatured" className="cursor-pointer">Request Featured</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Ask admin to feature this product</p>
                  </div>
                  <Switch
                    id="isFeatured"
                    checked={watch("isFeatured")}
                    onCheckedChange={(v) => setValue("isFeatured", v)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={submitting}
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Submitting...</>
              ) : (
                "Submit for Admin Approval"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}