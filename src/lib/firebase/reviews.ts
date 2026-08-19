import { cache } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  limit as fbLimit,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import { COLLECTIONS } from "./collections";
import type { Review, CreateReviewInput, ReviewSummary } from "@/lib/types/review";

function mapReviewDoc(docSnap: QueryDocumentSnapshot<DocumentData>): Review {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as Review;
}

export const getReviewsByProduct = cache(async function getReviewsByProduct(productId: string): Promise<Review[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.REVIEWS),
      where("productId", "==", productId)
    );
    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map(mapReviewDoc);
    return reviews.sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });
  } catch (err) {
    console.error("Error fetching reviews by product:", err);
    return [];
  }
});

export function computeReviewSummary(reviews: Review[]): ReviewSummary {
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRating = 0;

  for (const review of reviews) {
    const rounded = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
    if (rounded >= 1 && rounded <= 5) breakdown[rounded]++;
    totalRating += review.rating;
  }

  return {
    averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
    totalReviews: reviews.length,
    ratingBreakdown: breakdown,
  };
}

export async function hasUserReviewedOrder(
  userId: string,
  productId: string,
  orderId: string
): Promise<boolean> {
  try {
    const q = query(
      collection(db, COLLECTIONS.REVIEWS),
      where("userId", "==", userId),
      where("productId", "==", productId),
      where("orderId", "==", orderId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (err) {
    console.error("Error checking user order review status:", err);
    return false;
  }
}

export async function createReview(
  userId: string,
  userName: string,
  userPhoto: string | undefined,
  input: CreateReviewInput
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.REVIEWS), {
    productId: input.productId,
    userId,
    userName,
    userPhoto: userPhoto || "",
    orderId: input.orderId,
    rating: input.rating,
    title: input.title || "",
    comment: input.comment,
    images: input.images || [],
    isVerifiedPurchase: true,
    helpfulCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await recalculateProductRating(input.productId);
  return docRef.id;
}

async function recalculateProductRating(productId: string): Promise<void> {
  const reviews = await getReviewsByProduct(productId);
  const summary = computeReviewSummary(reviews);

  const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
  await updateDoc(productRef, {
    rating: Math.round(summary.averageRating * 10) / 10,
    reviewCount: summary.totalReviews,
  });
}

export async function markReviewHelpful(reviewId: string): Promise<void> {
  const ref = doc(db, COLLECTIONS.REVIEWS, reviewId);
  await updateDoc(ref, { helpfulCount: increment(1) });
}

export async function getAllReviews(maxCount = 20): Promise<Review[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.REVIEWS),
      orderBy("createdAt", "desc"),
      fbLimit(maxCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapReviewDoc);
  } catch (err) {
    console.error("Error fetching all reviews:", err);
    return [];
  }
}

export async function getReviewById(id: string): Promise<Review | null> {
  try {
    const ref = doc(db, COLLECTIONS.REVIEWS, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      id: snap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Review;
  } catch (err) {
    console.error("Error fetching review by id:", err);
    return null;
  }
}
