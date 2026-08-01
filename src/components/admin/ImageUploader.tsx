"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadMultipleImages } from "@/lib/firebase/storage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  thumbnailImage?: string;
  onThumbnailChange?: (url: string) => void;
  folder?: string;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onChange,
  thumbnailImage,
  onThumbnailChange,
  folder = "products",
  maxImages = 8,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const fileArray = Array.from(files).slice(0, remaining);
    const validFiles = fileArray.filter((f) => f.type.startsWith("image/"));

    if (validFiles.length === 0) {
      toast.error("Please select valid image files");
      return;
    }

    setUploading(true);
    try {
      const urls = await uploadMultipleImages(validFiles, folder);
      const newImages = [...images, ...urls];
      onChange(newImages);

      // Set first uploaded image as thumbnail if none set yet
      if (onThumbnailChange && !thumbnailImage && newImages.length > 0) {
        onThumbnailChange(newImages[0]);
      }
      toast.success(`${urls.length} image(s) uploaded successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload images. Check Firebase Storage configuration.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (url: string) => {
    const updated = images.filter((img) => img !== url);
    onChange(updated);
    if (onThumbnailChange && thumbnailImage === url) {
      onThumbnailChange(updated[0] || "");
    }
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
          dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-2" />
        ) : (
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        )}
        <p className="text-sm font-medium">
          {uploading ? "Uploading..." : "Click or drag images to upload"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PNG, JPG up to 5MB each ({images.length}/{maxImages})
        </p>
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {images.map((url) => (
            <div key={url} className="relative aspect-square rounded-lg overflow-hidden border group">
              <Image src={url} alt="" fill className="object-cover" sizes="100px" />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              {onThumbnailChange && (
                <button
                  type="button"
                  onClick={() => onThumbnailChange(url)}
                  className={cn(
                    "absolute bottom-1 left-1 h-5 w-5 rounded-full flex items-center justify-center transition-colors",
                    thumbnailImage === url
                      ? "bg-primary text-white"
                      : "bg-black/40 text-white opacity-0 group-hover:opacity-100"
                  )}
                  title="Set as thumbnail"
                >
                  <Star className={cn("h-3 w-3", thumbnailImage === url && "fill-current")} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
