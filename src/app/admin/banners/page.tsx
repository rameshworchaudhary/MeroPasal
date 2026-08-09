"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Plus, Image as ImageIcon, Trash2, Edit2, CheckCircle2,
  XCircle, ArrowUpDown, Loader2, RefreshCw, Upload, ExternalLink,
  Sparkles, ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  getAllBanners, createBanner, updateBanner, deleteBanner,
} from "@/lib/firebase/banners";
import { getAllCategories } from "@/lib/firebase/categories";
import { uploadImage } from "@/lib/firebase/storage";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { Banner, BannerFormInput } from "@/lib/types/banner";
import type { Category } from "@/lib/types/category";

const DEFAULT_SAMPLE_BANNERS: BannerFormInput[] = [
  {
    title: "Adivasi Vishvambhari Herbal Hair Oil",
    subtitle: "Save big on authentic recipes & 100% genuine herbal essentials",
    image: "/images/hero/Adivasi.jpg",
    linkType: "url",
    linkValue: "/products?q=hair+oil",
    position: "hero",
    displayOrder: 1,
    isActive: true,
  },
  {
    title: "Japanese Soothing Massage Gel",
    subtitle: "Premium natural relief & relaxation formula",
    image: "/images/hero/japan.jpg",
    linkType: "url",
    linkValue: "/products?q=massage+gel",
    position: "hero",
    displayOrder: 2,
    isActive: true,
  },
  {
    title: "Paras Herbal Essentials",
    subtitle: "Authentic herbal care for hair & skin wellness",
    image: "/images/hero/paras.jpg",
    linkType: "url",
    linkValue: "/products?q=paras",
    position: "hero",
    displayOrder: 3,
    isActive: true,
  },
];

export default function AdminBannersPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPosition, setFilterPosition] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [formData, setFormData] = useState<BannerFormInput>({
    title: "",
    subtitle: "",
    image: "",
    linkType: "url",
    linkValue: "",
    position: "hero",
    displayOrder: 1,
    isActive: true,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedBanners, fetchedCats] = await Promise.all([
        getAllBanners(),
        getAllCategories(),
      ]);
      setBanners(fetchedBanners);
      setCategories(fetchedCats);
    } catch (err) {
      console.error("Error loading banners:", err);
      toast.error("Failed to load banners from database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, loadData]);

  const handleOpenAddModal = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      subtitle: "",
      image: "",
      linkType: "url",
      linkValue: "",
      position: "hero",
      displayOrder: banners.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      image: banner.image || "",
      mobileImage: banner.mobileImage || "",
      linkType: banner.linkType || "url",
      linkValue: banner.linkValue || "",
      buttonText: banner.buttonText || "",
      position: banner.position || "hero",
      displayOrder: banner.displayOrder ?? 1,
      isActive: banner.isActive ?? true,
      startDate: banner.startDate || "",
      endDate: banner.endDate || "",
    });
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const downloadUrl = await uploadImage(file, "banners");
      setFormData((prev) => ({ ...prev, image: downloadUrl }));
      toast.success("Banner image attached successfully!");
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Failed to process image. Please try entering an Image URL directly.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a title for the banner.");
      return;
    }
    if (!formData.image.trim()) {
      toast.error("Please provide or upload a banner image.");
      return;
    }

    setSaving(true);
    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, formData);
        toast.success("Banner updated successfully!");
      } else {
        await createBanner(formData);
        toast.success("New banner created successfully!");
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save banner:", err);
      toast.error("Error saving banner. Check permissions.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (banner: Banner) => {
    try {
      const nextState = !banner.isActive;
      await updateBanner(banner.id, { isActive: nextState });
      setBanners((prev) =>
        prev.map((b) => (b.id === banner.id ? { ...b, isActive: nextState } : b))
      );
      toast.success(nextState ? "Banner activated!" : "Banner deactivated!");
    } catch (err) {
      console.error("Failed to toggle banner:", err);
      toast.error("Failed to update banner status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await deleteBanner(id);
      setBanners((prev) => prev.filter((b) => b.id !== id));
      toast.success("Banner deleted.");
    } catch (err) {
      console.error("Failed to delete banner:", err);
      toast.error("Failed to delete banner.");
    }
  };

  const handleSeedDefaults = async () => {
    setSaving(true);
    try {
      for (const sample of DEFAULT_SAMPLE_BANNERS) {
        await createBanner(sample);
      }
      toast.success("Default hero banners created successfully!");
      await loadData();
    } catch (err) {
      console.error("Failed to seed sample banners:", err);
      toast.error("Failed to seed default banners.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Admin Access Required</h2>
        <p className="text-slate-600 mt-2 max-w-md">
          Only authorized administrators can manage and upload shop promotional banners.
        </p>
      </div>
    );
  }

  const filteredBanners = banners.filter((b) => {
    if (filterPosition === "all") return true;
    return b.position === filterPosition;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Banner Management
            </h1>
            <Badge className="bg-blue-600 text-white font-bold">Admin Only</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Upload and manage hero carousels, promotional banners, and campaign ads for NexShop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 border-slate-300 hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md font-bold px-4"
          >
            <Plus className="h-4 w-4" /> Add New Banner
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: "all", label: "All Banners" },
          { id: "hero", label: "Home Hero Carousel" },
          { id: "secondary", label: "Secondary Promo" },
          { id: "sidebar", label: "Sidebar Ads" },
          { id: "popup", label: "Popups" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterPosition(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterPosition === tab.id
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Banner List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
          <p className="text-sm font-semibold text-slate-500">Loading promotional banners...</p>
        </div>
      ) : filteredBanners.length === 0 ? (
        <Card className="border-slate-200 text-center py-12 px-4 bg-white rounded-2xl">
          <CardContent className="space-y-4 max-w-md mx-auto">
            <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <ImageIcon className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">No Banners Found</CardTitle>
              <CardDescription className="text-sm text-slate-500 mt-1">
                You haven&apos;t uploaded any banners for this position yet. You can add a custom banner or initialize default hero banners.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button onClick={handleOpenAddModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-1.5" /> Upload First Banner
              </Button>
              {banners.length === 0 && (
                <Button
                  variant="outline"
                  onClick={handleSeedDefaults}
                  disabled={saving}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 font-bold w-full sm:w-auto"
                >
                  <Sparkles className="h-4 w-4 mr-1.5 text-blue-600" /> Seed Default Hero Banners
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBanners.map((banner) => (
            <Card
              key={banner.id}
              className={`overflow-hidden border transition-all duration-200 bg-white rounded-2xl ${
                banner.isActive
                  ? "border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                  : "border-slate-200 opacity-60 bg-slate-50"
              }`}
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.image || "/images/placeholder.jpg"}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80";
                  }}
                  referrerPolicy="no-referrer"
                />

                {/* Badges Overlays */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <Badge className="bg-slate-900/90 backdrop-blur-md text-white font-bold text-[10px] uppercase">
                    {banner.position}
                  </Badge>
                  {banner.isActive ? (
                    <Badge className="bg-emerald-600 text-white font-extrabold text-[10px]">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300 font-extrabold text-[10px]">
                      Inactive
                    </Badge>
                  )}
                </div>

                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[11px] font-bold">
                  Order: #{banner.displayOrder}
                </div>
              </div>

              {/* Banner Details */}
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base line-clamp-1">
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {banner.subtitle}
                    </p>
                  )}
                </div>

                {banner.linkValue && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg w-fit max-w-full">
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span className="truncate">{banner.linkValue}</span>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={banner.isActive}
                      onCheckedChange={() => handleToggleStatus(banner)}
                      aria-label="Toggle banner active status"
                    />
                    <span className="text-xs font-semibold text-slate-600">
                      {banner.isActive ? "Visible" : "Hidden"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditModal(banner)}
                      className="h-8 w-8 p-0 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(banner.id)}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal / Dialog Form for Add & Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  {editingBanner ? "Edit Banner" : "Add New Banner"}
                </h2>
                <p className="text-xs text-slate-500">
                  Configure promotional image, banner link, and display position.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-bold text-slate-700">
                  Banner Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Maha Dashain Festival Sale"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1.5">
                <Label htmlFor="subtitle" className="text-xs font-bold text-slate-700">
                  Subtitle / Promo Text
                </Label>
                <Input
                  id="subtitle"
                  placeholder="e.g. Flat 50% OFF on all authentic herbal products"
                  value={formData.subtitle || ""}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>

              {/* Image Upload or URL */}
              <div className="space-y-2 border p-3.5 rounded-xl bg-slate-50">
                <Label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Banner Image *</span>
                  {uploadingImage && <span className="text-blue-600 font-semibold animate-pulse">Uploading...</span>}
                </Label>

                {/* File Upload Button */}
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white rounded-xl cursor-pointer transition-colors text-xs font-bold text-slate-700">
                    <Upload className="h-4 w-4 text-blue-600" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Direct Image URL input */}
                <div className="space-y-1">
                  <Label htmlFor="image" className="text-[11px] text-slate-500 font-semibold">
                    Or Enter Direct Image URL
                  </Label>
                  <Input
                    id="image"
                    placeholder="https://images.unsplash.com/... or /images/hero/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                  />
                </div>

                {/* Preview Image if valid */}
                {formData.image && (
                  <div className="relative aspect-[16/7] w-full rounded-lg overflow-hidden border mt-2 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.image}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Position & Display Order */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="position" className="text-xs font-bold text-slate-700">
                    Display Position
                  </Label>
                  <select
                    id="position"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        position: e.target.value as BannerFormInput["position"],
                      })
                    }
                    className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hero">Home Hero Carousel</option>
                    <option value="secondary">Secondary Promo</option>
                    <option value="sidebar">Sidebar Ad</option>
                    <option value="popup">Popup Modal</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="displayOrder" className="text-xs font-bold text-slate-700">
                    Display Order (#)
                  </Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    min={1}
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })
                    }
                  />
                </div>
              </div>

              {/* Link Redirection */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="linkType" className="text-xs font-bold text-slate-700">
                    Link Type
                  </Label>
                  <select
                    id="linkType"
                    value={formData.linkType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        linkType: e.target.value as BannerFormInput["linkType"],
                      })
                    }
                    className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="url">Direct URL / Query</option>
                    <option value="category">Category Page</option>
                    <option value="product">Product Page</option>
                    <option value="none">No Link</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="linkValue" className="text-xs font-bold text-slate-700">
                    Target Slug or URL
                  </Label>
                  {formData.linkType === "category" ? (
                    <select
                      id="linkValue"
                      value={formData.linkValue || ""}
                      onChange={(e) => setFormData({ ...formData, linkValue: e.target.value })}
                      className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name} ({c.slug})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id="linkValue"
                      placeholder={
                        formData.linkType === "product"
                          ? "e.g. hair-oil-product"
                          : "e.g. /products?q=herbal"
                      }
                      value={formData.linkValue || ""}
                      onChange={(e) => setFormData({ ...formData, linkValue: e.target.value })}
                    />
                  )}
                </div>
              </div>

              {/* Active Switch */}
              <div className="flex items-center justify-between p-3 border rounded-xl bg-slate-50">
                <div>
                  <p className="text-xs font-bold text-slate-800">Publish & Activate</p>
                  <p className="text-[11px] text-slate-500">
                    Active banners will immediately display to store visitors.
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
                    </>
                  ) : editingBanner ? (
                    "Update Banner"
                  ) : (
                    "Create Banner"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
