"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/admin/DataTable";
import CouponFormDialog from "@/components/admin/CouponFormDialog";
import { deleteCoupon } from "@/lib/firebase/coupons";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Coupon } from "@/lib/types/coupon";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AdminCouponsClientProps {
  initialCoupons: Coupon[];
}

export default function AdminCouponsClient({ initialCoupons }: AdminCouponsClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);

  const filtered = search.trim()
    ? initialCoupons.filter((c) => c.code.toLowerCase().includes(search.toLowerCase()))
    : initialCoupons;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied!");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCoupon(deleteTarget.id);
      toast.success("Coupon deleted");
      setDeleteTarget(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  const isExpired = (coupon: Coupon) => new Date(coupon.endDate) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coupons</h1>
          <p className="text-sm text-muted-foreground mt-1">{initialCoupons.length} total coupons</p>
        </div>
        <Button onClick={() => { setEditing(undefined); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Create Coupon
        </Button>
      </div>

      <DataTable
        data={filtered}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search coupon code..."
        rowKey={(c) => c.id}
        columns={[
          {
            header: "Code",
            accessor: (c) => (
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold">{c.code}</span>
                <button onClick={() => handleCopy(c.code)} className="text-muted-foreground hover:text-foreground">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            ),
          },
          { header: "Description", accessor: (c) => <span className="text-muted-foreground line-clamp-1">{c.description}</span> },
          {
            header: "Discount",
            accessor: (c) => c.type === "percentage" ? `${c.value}%` : formatCurrency(c.value),
          },
          { header: "Min Order", accessor: (c) => formatCurrency(c.minOrderValue) },
          { header: "Usage", accessor: (c) => `${c.usedCount}/${c.usageLimit || "∞"}` },
          { header: "Valid Until", accessor: (c) => formatDate(c.endDate) },
          {
            header: "Status",
            accessor: (c) => (
              <Badge variant={!c.isActive ? "outline" : isExpired(c) ? "destructive" : "success"}>
                {!c.isActive ? "Inactive" : isExpired(c) ? "Expired" : "Active"}
              </Badge>
            ),
          },
          {
            header: "Actions",
            accessor: (c) => (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(c); setDialogOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(c)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
      />

      <CouponFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editing}
        onSaved={() => router.refresh()}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-bold text-lg">Delete Coupon?</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete "{deleteTarget.code}"?
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
