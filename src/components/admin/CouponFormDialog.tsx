"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createCoupon, updateCoupon } from "@/lib/firebase/coupons";
import type { Coupon } from "@/lib/types/coupon";
import { toast } from "sonner";

const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  description: z.string().min(3, "Description is required"),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().positive("Value must be positive"),
  minOrderValue: z.coerce.number().min(0),
  maxDiscountAmount: z.coerce.number().optional(),
  usageLimit: z.coerce.number().min(0),
  perUserLimit: z.coerce.number().min(0),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
  isActive: z.boolean().default(true),
});

type CouponFormSchema = z.infer<typeof couponSchema>;

interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Coupon;
  onSaved: () => void;
}

export default function CouponFormDialog({ open, onOpenChange, initialData, onSaved }: CouponFormDialogProps) {
  const isEdit = !!initialData;

  const {
    register, handleSubmit, watch, setValue, formState: { errors, isSubmitting }, reset,
  } = useForm<CouponFormSchema>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: initialData?.code || "",
      description: initialData?.description || "",
      type: initialData?.type || "percentage",
      value: initialData?.value || 10,
      minOrderValue: initialData?.minOrderValue || 0,
      maxDiscountAmount: initialData?.maxDiscountAmount,
      usageLimit: initialData?.usageLimit || 0,
      perUserLimit: initialData?.perUserLimit || 1,
      startDate: initialData?.startDate?.split("T")[0] || new Date().toISOString().split("T")[0],
      endDate: initialData?.endDate?.split("T")[0] || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        code: initialData?.code || "",
        description: initialData?.description || "",
        type: initialData?.type || "percentage",
        value: initialData?.value || 10,
        minOrderValue: initialData?.minOrderValue || 0,
        maxDiscountAmount: initialData?.maxDiscountAmount,
        usageLimit: initialData?.usageLimit || 0,
        perUserLimit: initialData?.perUserLimit || 1,
        startDate: initialData?.startDate?.split("T")[0] || new Date().toISOString().split("T")[0],
        endDate: initialData?.endDate?.split("T")[0] || "",
        isActive: initialData?.isActive ?? true,
      });
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: CouponFormSchema) => {
    try {
      const payload = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };
      if (isEdit && initialData) {
        await updateCoupon(initialData.id, payload);
        toast.success("Coupon updated!");
      } else {
        await createCoupon(payload);
        toast.success("Coupon created!");
      }
      onOpenChange(false);
      onSaved();
    } catch {
      toast.error("Failed to save coupon");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{isEdit ? "Edit Coupon" : "Create New Coupon"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="code">Coupon Code *</Label>
            <Input id="code" className="uppercase" placeholder="WELCOME10" {...register("code")} />
            {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" rows={2} {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Discount Type</Label>
              <Select value={watch("type")} onValueChange={(v) => setValue("type", v as "percentage" | "fixed")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount (Rs.)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="value">Value *</Label>
              <Input id="value" type="number" {...register("value")} />
              {errors.value && <p className="text-xs text-destructive">{errors.value.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="minOrderValue">Min Order Value (Rs.)</Label>
              <Input id="minOrderValue" type="number" {...register("minOrderValue")} />
            </div>
            {watch("type") === "percentage" && (
              <div className="space-y-1.5">
                <Label htmlFor="maxDiscountAmount">Max Discount (Rs.)</Label>
                <Input id="maxDiscountAmount" type="number" {...register("maxDiscountAmount")} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="usageLimit">Total Usage Limit</Label>
              <Input id="usageLimit" type="number" placeholder="0 = unlimited" {...register("usageLimit")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="perUserLimit">Per User Limit</Label>
              <Input id="perUserLimit" type="number" placeholder="0 = unlimited" {...register("perUserLimit")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
              {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">End Date *</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
              {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
            <Switch id="isActive" checked={watch("isActive")} onCheckedChange={(v) => setValue("isActive", v)} />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isEdit ? "Update Coupon" : "Create Coupon"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
