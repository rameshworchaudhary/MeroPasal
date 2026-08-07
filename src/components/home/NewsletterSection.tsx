"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="bg-black text-white py-12 sm:py-16">
      <div className="container mx-auto px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-xl"
        >
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black font-bold">
              <Mail className="h-5 w-5" />
            </div>
          </div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            The NexShop Newsletter
          </p>
          <h2 className="mb-2 font-serif text-2xl sm:text-3xl font-bold text-white">
            Get Exclusive Nepal Offers
          </h2>
          <p className="mx-auto mb-6 max-w-md text-xs sm:text-sm leading-relaxed text-neutral-300">
            Subscribe for secret flash sales, new arrival alerts, and special discount vouchers delivered directly to your inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-2 font-bold text-white text-sm"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Thank you for subscribing to NexShop Nepal!</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 flex-1 rounded-xl border-neutral-700 bg-neutral-900 px-4 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus-visible:border-white focus-visible:ring-0"
              />
              <Button type="submit" disabled={loading} className="h-11 rounded-xl bg-white text-black font-bold px-6 text-xs uppercase tracking-wider hover:bg-neutral-200">
                {loading ? "Joining..." : "Subscribe"}
              </Button>
            </form>
          )}

          <p className="mt-3 text-[11px] text-neutral-500">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
