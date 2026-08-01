"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, MessageSquare, PhoneCall, X } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants/site";

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Floating Buttons Group */}
      <div className="fixed bottom-20 md:bottom-8 right-4 z-40 flex flex-col gap-2.5 items-end">
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-white shadow-xl hover:bg-blue-600 transition-all hover:scale-110 active:scale-95"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}

        {/* Floating Chat Support Button */}
        <button
          onClick={() => setChatOpen((prev) => !prev)}
          aria-label="Help & Support Chat"
          className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-110 active:scale-95 relative"
        >
          {chatOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
        </button>
      </div>

      {/* Quick Support Dialog */}
      {chatOpen && (
        <div className="fixed bottom-36 md:bottom-24 right-4 z-50 w-72 sm:w-80 rounded-2xl border border-slate-800 bg-slate-950/98 p-4 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                🇳🇵
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Kinbey Support</h4>
                <p className="text-[10px] text-emerald-400 font-medium">Online 24/7 across Nepal</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Need help with your order or product inquiries? Contact our Kathmandu support team!
          </p>

          <div className="space-y-2">
            <a
              href={`tel:${SITE_CONFIG.contact.phone}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-all"
            >
              <PhoneCall className="h-3.5 w-3.5" /> Call +977 9742491352
            </a>
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-all"
            >
              <MessageSquare className="h-3.5 w-3.5" /> WhatsApp Support
            </a>
          </div>
        </div>
      )}
    </>
  );
}
