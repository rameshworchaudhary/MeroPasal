"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImagePlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage, deleteImageByUrl } from "@/lib/firebase/storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder = "products",
  label = "Product Image",
  description = "Upload high quality JPG, PNG, or WEBP (Max 5MB)",
  disabled = false,
  className,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || uploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !uploading) setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleRemove = async () => {
    if (!value) return;
    try {
      await deleteImageByUrl(value);
    } catch {
      // Ignore storage cleanup error
    }
    onChange("");
    toast.info("Image removed");
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium text-slate-200">{label}</label>}

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60 p-2 flex items-center gap-4">
          <div className="relative h-28 w-28 rounded-lg overflow-hidden border border-slate-700/60 bg-slate-950 flex-shrink-0">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="112px"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0 pr-10">
            <p className="text-xs font-semibold text-slate-200 truncate">{value.split("/").pop()?.split("?")[0] || "Image File"}</p>
            <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
              ✓ Direct Firebase Storage Upload
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 h-7 text-xs border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200"
            >
              Replace Image
            </Button>
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            disabled={disabled}
            onClick={handleRemove}
            className="absolute top-3 right-3 h-7 w-7 rounded-full bg-red-600/80 hover:bg-red-600 text-white shadow-md"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2",
            dragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-slate-800 bg-slate-900/40 hover:border-blue-500/50 hover:bg-slate-900/80",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {uploading ? (
            <div className="py-3 flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-xs font-medium text-blue-400">Uploading to Firebase Storage...</p>
            </div>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-1">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Click to upload or drag & drop image
              </p>
              {description && <p className="text-xs text-slate-400">{description}</p>}
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}
