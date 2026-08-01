"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_VISUAL_PRODUCTS = [
  {
    title: "Men's Sneakers",
    query: "shoes",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80",
  },
  {
    title: "Smart Watch",
    query: "watch",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
  },
  {
    title: "Handbag",
    query: "fashion",
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80",
  },
  {
    title: "Wireless Headphones",
    query: "headphones",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
  },
];

export default function ImageSearchModal({ isOpen, onClose }: ImageSearchModalProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSelectSample = (imgUrl: string, query: string) => {
    setSelectedImage(imgUrl);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      onClose();
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        onClose();
        router.push(`/search?q=electronics`);
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20 mb-3">
              <Sparkles className="h-3.5 w-3.5" /> AI Visual Lens
            </div>
            <h3 className="text-xl font-bold text-white">Search Kinbey By Image</h3>
            <p className="mt-1 text-xs text-slate-400">
              Upload a screenshot or photo to find similar products instantly
            </p>

            {/* Upload Box */}
            <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/60 p-6 transition-all hover:border-blue-500 hover:bg-blue-950/20">
              {analyzing ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-blue-500">
                    {selectedImage && (
                      <Image src={selectedImage} alt="Uploaded" fill className="object-cover" />
                    )}
                    <motion.div
                      animate={{ y: ["0%", "100%", "0%"] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      className="absolute inset-x-0 top-0 h-1 bg-blue-400 shadow-[0_0_8px_#3b82f6]"
                    />
                  </div>
                  <p className="mt-3 text-xs font-bold text-blue-400 animate-pulse flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> AI Scanning Image...
                  </p>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 mb-3">
                    <Camera className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-semibold text-white">
                    Drag & drop or <span className="text-blue-400 underline">browse photo</span>
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">Supports JPG, PNG, WEBP</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              )}
            </div>

            {/* Sample Images to Try */}
            <div className="mt-6 text-left">
              <p className="text-xs font-bold text-slate-300 mb-3">Or try these sample items:</p>
              <div className="grid grid-cols-4 gap-2">
                {SAMPLE_VISUAL_PRODUCTS.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => handleSelectSample(item.img, item.query)}
                    className="group relative flex flex-col items-center overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-1.5 transition-all hover:border-blue-500 hover:scale-[1.03]"
                  >
                    <div className="relative h-16 w-full rounded-lg overflow-hidden bg-slate-900">
                      <Image src={item.img} alt={item.title} fill className="object-cover" />
                    </div>
                    <span className="mt-1.5 text-[10px] font-medium text-slate-300 truncate w-full text-center">
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
