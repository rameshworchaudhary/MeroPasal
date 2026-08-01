"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import BannerFormDialog from "@/components/admin/BannerFormDialog";
import { deleteBanner } from "@/lib/firebase/banners";
import type { Banner } from "@/lib/types/banner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AdminBannersClientProps {
  initialBanners: Banner[];
}

const POSITION_LABELS: Record<string, string> = {
  hero: "Hero Carousel",
  secondary: "Secondary Promo",
  sidebar: "Sidebar",
  popup: "Popup",
};

export default function AdminBannersClient({ initialBanners }: AdminBannersClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBanner(deleteTarget.id);
      toast.success("Banner deleted");
      setDeleteTarget(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete banner");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-sm text-muted-foreground mt-1">{initialBanners.length} total banners</p>
        </div>
        <Button onClick={() => { setEditing(undefined); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Banner
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialBanners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden">
            <div className="relative h-32 bg-muted">
              <Image src={banner.image} alt={banner.title} fill className="object-cover" sizes="400px" />
              <Badge className="absolute top-2 right-2 text-xs" variant={banner.isActive ? "success" : "outline"}>
                {banner.isActive ? "Active" : "Hidden"}
              </Badge>
            </div>
            <CardContent className="p-4">
              <p className="font-semibold text-sm line-clamp-1">{banner.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{POSITION_LABELS[banner.position]} • Order: {banner.displayOrder}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={() => { setEditing(banner); setDialogOpen(true); }}>
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="outline" className="flex-1 h-7 text-xs text-destructive hover:text-destructive" onClick={() => setDeleteTarget(banner)}>
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {initialBanners.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No banners created yet</div>
      )}

      <BannerFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editing} onSaved={() => router.refresh()} />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-bold text-lg">Delete Banner?</h3>
            <p className="text-sm text-muted-foreground">Are you sure you want to delete "{deleteTarget.title}"?</p>
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
