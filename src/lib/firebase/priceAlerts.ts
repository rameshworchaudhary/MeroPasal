import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "./config";
import { COLLECTIONS } from "./collections";

export interface CreatePriceAlertInput {
  productId: string;
  productName: string;
  currentPrice: number;
  email: string;
  userId?: string | null;
  targetPrice?: number;
}

export async function createPriceAlert(input: CreatePriceAlertInput): Promise<string> {
  const collectionRef = collection(db, COLLECTIONS.PRICE_ALERTS);

  const normalizedEmail = input.email.trim().toLowerCase();

  // Check if an active alert already exists for this email & productId
  try {
    const q = query(
      collectionRef,
      where("productId", "==", input.productId),
      where("email", "==", normalizedEmail),
      where("status", "==", "active")
    );
    const existingDocs = await getDocs(q);
    if (!existingDocs.empty) {
      throw new Error("You already have an active price alert for this product.");
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("already have an active price alert")) {
      throw err;
    }
    // Ignore index or other query errors, proceed to addDoc
  }

  const docRef = await addDoc(collectionRef, {
    productId: input.productId,
    productName: input.productName,
    currentPrice: input.currentPrice,
    targetPrice: input.targetPrice || input.currentPrice,
    email: normalizedEmail,
    userId: input.userId || null,
    status: "active",
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}
