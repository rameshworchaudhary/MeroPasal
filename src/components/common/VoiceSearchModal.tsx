"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, Sparkles, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_SPOKEN_PHRASES = [
  "Looking for latest Samsung 5G phones...",
  "Searching traditional Nepali Dhaka topi & Kurti...",
  "Finding wireless noise cancelling earbuds...",
  "Searching Goldstar sneakers & sports shoes...",
];

export default function VoiceSearchModal({ isOpen, onClose }: VoiceSearchModalProps) {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sampleIdx, setSampleIdx] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsListening(true);
      setTranscript("");
      const interval = setInterval(() => {
        setSampleIdx((prev) => (prev + 1) % SAMPLE_SPOKEN_PHRASES.length);
      }, 2500);

      // Simulate voice recognition auto-completion after 4.5 seconds if user clicks or speaks
      const timer = setTimeout(() => {
        const query = "Samsung 5G";
        setTranscript(query);
        setIsListening(false);
      }, 4000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  const handleApplyQuery = (query: string) => {
    onClose();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl"
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
              <Sparkles className="h-3.5 w-3.5" /> AI Voice Search
            </div>
            <h3 className="text-xl font-bold text-white">Speak to Search NexShop</h3>
            <p className="mt-1 text-xs text-slate-400">
              Say product names, categories, or brands in Nepali or English
            </p>

            {/* Listening Pulse Visualizer */}
            <div className="my-8 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                {isListening && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                      className="absolute h-28 w-28 rounded-full bg-blue-500/20"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0.05, 0.4] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                      className="absolute h-36 w-36 rounded-full bg-blue-600/10"
                    />
                  </>
                )}

                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-all ${
                    isListening
                      ? "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-blue-500/40"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {isListening ? (
                    <Mic className="h-8 w-8 animate-pulse" />
                  ) : (
                    <MicOff className="h-8 w-8" />
                  )}
                </button>
              </div>

              {/* Status & Animated Wave */}
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 animate-bounce" />
                {isListening ? "Listening..." : "Click mic to speak"}
              </p>

              {/* Prompt suggestion */}
              <div className="mt-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 px-4 py-2.5 text-xs text-slate-300 w-full">
                {transcript ? (
                  <p className="font-semibold text-white">&quot;{transcript}&quot;</p>
                ) : (
                  <p className="italic text-slate-400">&quot;{SAMPLE_SPOKEN_PHRASES[sampleIdx]}&quot;</p>
                )}
              </div>
            </div>

            {/* Suggested Voice Tags */}
            <div className="mt-4">
              <p className="text-[11px] text-slate-400 mb-2 font-medium">Quick Voice Searches:</p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {["Smartphones", "Summer Fashion", "Air Conditioners", "Dry Fruits"].map((item) => (
                  <button
                    key={item}
                    onClick={() => handleApplyQuery(item)}
                    className="rounded-full border border-slate-800 bg-slate-800/60 px-3 py-1 text-[11px] font-medium text-slate-300 hover:border-blue-500 hover:bg-blue-600/10 hover:text-blue-300 transition-all"
                  >
                    &quot;{item}&quot;
                  </button>
                ))}
              </div>
            </div>

            {transcript && (
              <Button
                onClick={() => handleApplyQuery(transcript)}
                className="mt-6 w-full rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
              >
                Search &quot;{transcript}&quot;
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
