"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageUploader from "@/components/admin/ImageUploader";
import { createBanner, updateBanner } from "@/lib/firebase/banners";
import type { Banner } from "@/lib/types/banner";
import { toast } from "sonner";

const bannerSchema = z.object({
  title: z.string().min(2, "Title is required"),
  subtitle: z.string().optional(),
  linkType: z.enum(["product", "category", "url", "none"]),
  linkValue: z.string().optional(),
  buttonText: z.string().optional(),
  position: z.enum(["hero", "secondary", "sidebar", "popup"]),
  displayOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type BannerFormSchema = z.infer<typeof bannerSchema>;

interface BannerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Banner;
  onSaved: () => void;
}

export default function BannerFormDialog({ open, onOpenChange, initialData, onSaved }: BannerFormDialogProps) {
  const isEdit = !!initialData;
  const [image, setImage] = useState(initialData?.image || "");

  const {
    register, handleSubmit, watch, setValue, formState: { errors, isSubmitting }, reset,
  } = useForm<BannerFormSchema>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      linkType: initialData?.linkType || "url",
      linkValue: initialData?.linkValue || "",
      buttonText: initialData?.buttonText || "Shop Now",
      position: initialData?.position || "hero",
      displayOrder: initialData?.displayOrder || 0,
      isActive: initialData?.isActive ?? true,
      startDate: initialData?.startDate?.split("T")[0] || "",
      endDate: initialData?.endDate?.split("T")[0] || "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: initialData?.title || "",
        subtitle: initialData?.subtitle || "",
        linkType: initialData?.linkType || "url",
        linkValue: initialData?.linkValue || "",
        buttonText: initialData?.buttonText || "Shop Now",
        position: initialData?.position || "hero",
        displayOrder: initialData?.displayOrder || 0,
        isActive: initialData?.isActive ?? true,
        startDate: initialData?.startDate?.split("T")[0] || "",
        endDate: initialData?.endDate?.split("T")[0] || "",
      });
      setImage(initialData?.image || "");
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: BannerFormSchema) => {
    if (!image) {
      toast.error("Please upload a banner image");
      return;
    }
    try {
      const payload = {
        ...data,
        image,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      };
      if (isEdit && initialData) {
        await updateBanner(initialData.id, payload);
        toast.success("Banner updated!");
      } else {
        await createBanner(payload);
        toast.success("Banner created!");
      }
      onOpenChange(false);
      onSaved();
    } catch {
      toast.error("Failed to save banner");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{isEdit ? "Edit Banner" : "Add New Banner"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" {...register("subtitle")} />
          </div>

          <div className="space-y-1.5">
            <Label>Banner Image *</Label>
            <ImageUploader images={image ? [image] : []} onChange={(imgs) => setImage(imgs[0] || "")} folder="banners" maxImages={1} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Link Type</Label>
              <Select value={watch("linkType")} onValueChange={(v) => setValue("linkType", v as BannerFormSchema["linkType"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="url">Custom URL</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="none">No Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="linkValue">Link Value</Label>
              <Input id="linkValue" placeholder="/products or slug" {...register("linkValue")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="buttonText">Button Text</Label>
            <Input id="buttonText" {...register("buttonText")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Position</Label>
              <Select value={watch("position")} onValueChange={(v) => setValue("position", v as BannerFormSchema["position"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Hero Carousel</SelectItem>
                  <SelectItem value="secondary">Secondary Promo</SelectItem>
                  <SelectItem value="sidebar">Sidebar</SelectItem>
                  <SelectItem value="popup">Popup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input id="displayOrder" type="number" {...register("displayOrder")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
            <Switch id="isActive" checked={watch("isActive")} onCheckedChange={(v) => setValue("isActive", v)} />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isEdit ? "Update Banner" : "Create Banner"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
