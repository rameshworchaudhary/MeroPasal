"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ShippingZoneFormDialog from "@/components/admin/ShippingZoneFormDialog";
import { deleteShippingZone } from "@/lib/firebase/shipping";
import { formatCurrency } from "@/lib/utils";
import type { ShippingZone } from "@/lib/types/nepal-address";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AdminShippingClientProps {
  initialZones: ShippingZone[];
}

export default function AdminShippingClient({ initialZones }: AdminShippingClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ShippingZone | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<ShippingZone | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteShippingZone(deleteTarget.id);
      toast.success("Shipping zone deleted");
      setDeleteTarget(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete shipping zone");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" /> Shipping Zones
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage delivery charges by district across Nepal
          </p>
        </div>
        <Button onClick={() => { setEditing(undefined); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Zone
        </Button>
      </div>

      {initialZones.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Truck className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No shipping zones configured yet</p>
            <p className="text-xs mt-1">Add zones to set delivery charges for different districts</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {initialZones.map((zone) => (
            <Card key={zone.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{zone.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{zone.estimatedDays} delivery</p>
                  </div>
                  <Badge variant={zone.isActive ? "success" : "outline"}>
                    {zone.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm mb-3">
                  <div>
                    <span className="text-muted-foreground">Charge: </span>
                    <span className="font-semibold">{formatCurrency(zone.charge)}</span>
                  </div>
                  {zone.freeShippingThreshold && (
                    <div>
                      <span className="text-muted-foreground">Free above: </span>
                      <span className="font-semibold">{formatCurrency(zone.freeShippingThreshold)}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-3 max-h-20 overflow-y-auto">
                  {zone.districts.slice(0, 10).map((d) => (
                    <Badge key={d} variant="outline" className="text-xs">{d}</Badge>
                  ))}
                  {zone.districts.length > 10 && (
                    <Badge variant="outline" className="text-xs">+{zone.districts.length - 10} more</Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={() => { setEditing(zone); setDialogOpen(true); }}>
                    <Pencil className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs text-destructive hover:text-destructive" onClick={() => setDeleteTarget(zone)}>
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ShippingZoneFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editing} onSaved={() => router.refresh()} />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-bold text-lg">Delete Shipping Zone?</h3>
            <p className="text-sm text-muted-foreground">Are you sure you want to delete "{deleteTarget.name}"?</p>
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
