"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createShippingZone, updateShippingZone } from "@/lib/firebase/shipping";
import { getAllDistrictsFlat } from "@/lib/constants/nepal-data";
import type { ShippingZone } from "@/lib/types/nepal-address";
import { toast } from "sonner";

const zoneSchema = z.object({
  name: z.string().min(2, "Zone name is required"),
  charge: z.coerce.number().min(0, "Charge cannot be negative"),
  freeShippingThreshold: z.coerce.number().optional(),
  estimatedDays: z.string().min(1, "Estimated delivery time is required"),
  isActive: z.boolean().default(true),
});

type ZoneFormSchema = z.infer<typeof zoneSchema>;

interface ShippingZoneFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ShippingZone;
  onSaved: () => void;
}

export default function ShippingZoneFormDialog({
  open, onOpenChange, initialData, onSaved,
}: ShippingZoneFormDialogProps) {
  const isEdit = !!initialData;
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(initialData?.districts || []);
  const [districtToAdd, setDistrictToAdd] = useState("");

  const allDistricts = getAllDistrictsFlat();
  const availableDistricts = allDistricts.filter((d) => !selectedDistricts.includes(d.district));

  const {
    register, handleSubmit, watch, setValue, formState: { errors, isSubmitting }, reset,
  } = useForm<ZoneFormSchema>({
    resolver: zodResolver(zoneSchema),
    defaultValues: {
      name: initialData?.name || "",
      charge: initialData?.charge ?? 100,
      freeShippingThreshold: initialData?.freeShippingThreshold,
      estimatedDays: initialData?.estimatedDays || "2-3 days",
      isActive: initialData?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name || "",
        charge: initialData?.charge ?? 100,
        freeShippingThreshold: initialData?.freeShippingThreshold,
        estimatedDays: initialData?.estimatedDays || "2-3 days",
        isActive: initialData?.isActive ?? true,
      });
      setSelectedDistricts(initialData?.districts || []);
    }
  }, [open, initialData, reset]);

  const handleAddDistrict = (district: string) => {
    if (district && !selectedDistricts.includes(district)) {
      setSelectedDistricts([...selectedDistricts, district]);
    }
    setDistrictToAdd("");
  };

  const handleRemoveDistrict = (district: string) => {
    setSelectedDistricts(selectedDistricts.filter((d) => d !== district));
  };

  const onSubmit = async (data: ZoneFormSchema) => {
    if (selectedDistricts.length === 0) {
      toast.error("Please add at least one district to this zone");
      return;
    }
    try {
      const payload = { ...data, districts: selectedDistricts };
      if (isEdit && initialData) {
        await updateShippingZone(initialData.id, payload);
        toast.success("Shipping zone updated!");
      } else {
        await createShippingZone(payload);
        toast.success("Shipping zone created!");
      }
      onOpenChange(false);
      onSaved();
    } catch {
      toast.error("Failed to save shipping zone");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{isEdit ? "Edit Shipping Zone" : "Add Shipping Zone"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Zone Name *</Label>
            <Input id="name" placeholder="e.g. Inside Kathmandu Valley" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="charge">Shipping Charge (Rs.) *</Label>
              <Input id="charge" type="number" {...register("charge")} />
              {errors.charge && <p className="text-xs text-destructive">{errors.charge.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="freeShippingThreshold">Free Shipping Above (Rs.)</Label>
              <Input id="freeShippingThreshold" type="number" placeholder="Optional" {...register("freeShippingThreshold")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="estimatedDays">Estimated Delivery Time *</Label>
            <Input id="estimatedDays" placeholder="e.g. 1-2 days" {...register("estimatedDays")} />
            {errors.estimatedDays && <p className="text-xs text-destructive">{errors.estimatedDays.message}</p>}
          </div>

          {/* Districts */}
          <div className="space-y-2">
            <Label>Districts in this Zone *</Label>
            <Select value={districtToAdd} onValueChange={handleAddDistrict}>
              <SelectTrigger><SelectValue placeholder="Add a district..." /></SelectTrigger>
              <SelectContent className="max-h-64">
                {availableDistricts.map((d) => (
                  <SelectItem key={d.district} value={d.district}>{d.district} ({d.province})</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 border rounded-lg min-h-[3rem]">
              {selectedDistricts.length === 0 ? (
                <p className="text-xs text-muted-foreground">No districts added yet</p>
              ) : (
                selectedDistricts.map((d) => (
                  <Badge key={d} variant="secondary" className="gap-1 text-xs">
                    {d}
                    <button type="button" onClick={() => handleRemoveDistrict(d)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
            <Switch id="isActive" checked={watch("isActive")} onCheckedChange={(v) => setValue("isActive", v)} />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isEdit ? "Update Zone" : "Create Zone"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
