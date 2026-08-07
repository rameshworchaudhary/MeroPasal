"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllReviews } from "@/lib/firebase/reviews";
import type { Review } from "@/lib/types/review";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await getAllReviews();
        setReviews(data || []);
      } catch (err) {
        console.error("Failed to fetch customer reviews:", err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  if (loading || reviews.length === 0) {
    return null;
  }

  const displayReviews = reviews.slice(0, 4);

  return (
    <section className="max-w-[1400px] mx-auto px-3 sm:px-6 my-4 sm:my-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
          <h2 className="font-serif text-base sm:text-lg font-bold text-black">
            Customer Feedback
          </h2>
          <Link
            href="/reviews"
            className="text-xs font-bold text-black hover:underline transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {displayReviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 shadow-2xs hover:border-black hover:bg-white transition-all"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <Avatar className="h-9 w-9 border border-neutral-300">
                  <AvatarImage src={review.userPhoto} alt={review.userName} />
                  <AvatarFallback className="bg-black text-white text-xs font-bold">
                    {(review.userName || "U").charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-xs text-black line-clamp-1">
                    {review.userName || "Customer"}
                  </h4>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {Array.from({ length: Math.min(5, Math.max(1, review.rating || 5)) }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-black text-black" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed italic line-clamp-3">
                &quot;{review.comment || review.title}&quot;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
