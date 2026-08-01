import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import { COLLECTIONS } from "./collections";
import type { Coupon, CouponFormInput, CouponValidationResult } from "@/lib/types/coupon";

function mapCouponDoc(docSnap: QueryDocumentSnapshot<DocumentData>): Coupon {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as Coupon;
}

export async function getAllCoupons(): Promise<Coupon[]> {
  const q = query(collection(db, COLLECTIONS.COUPONS), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapCouponDoc);
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const q = query(
    collection(db, COLLECTIONS.COUPONS),
    where("code", "==", code.toUpperCase())
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return mapCouponDoc(snapshot.docs[0]);
}

export async function validateCoupon(
  code: string,
  cartSubtotal: number,
  userPreviousUsageCount = 0
): Promise<CouponValidationResult> {
  const coupon = await getCouponByCode(code);

  if (!coupon) return { valid: false, message: "Invalid coupon code." };
  if (!coupon.isActive) return { valid: false, message: "This coupon is no longer active." };

  const now = new Date();
  if (now < new Date(coupon.startDate)) return { valid: false, message: "This coupon is not yet valid." };
  if (now > new Date(coupon.endDate)) return { valid: false, message: "This coupon has expired." };
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit)
    return { valid: false, message: "This coupon has reached its usage limit." };
  if (coupon.perUserLimit > 0 && userPreviousUsageCount >= coupon.perUserLimit)
    return { valid: false, message: "You have already used this coupon the maximum number of times." };
  if (cartSubtotal < coupon.minOrderValue)
    return {
      valid: false,
      message: `Minimum order value of Rs. ${coupon.minOrderValue} required for this coupon.`,
    };

  let discountAmount =
    coupon.type === "percentage"
      ? (cartSubtotal * coupon.value) / 100
      : coupon.value;

  if (coupon.type === "percentage" && coupon.maxDiscountAmount) {
    discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
  }
  discountAmount = Math.min(discountAmount, cartSubtotal);

  return { valid: true, discountAmount, coupon };
}

export async function createCoupon(input: CouponFormInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.COUPONS), {
    ...input,
    code: input.code.toUpperCase(),
    usedCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateCoupon(id: string, input: Partial<CouponFormInput>): Promise<void> {
  const ref = doc(db, COLLECTIONS.COUPONS, id);
  await updateDoc(ref, {
    ...input,
    ...(input.code ? { code: input.code.toUpperCase() } : {}),
    updatedAt: serverTimestamp(),
  });
}

export async function incrementCouponUsage(id: string): Promise<void> {
  const ref = doc(db, COLLECTIONS.COUPONS, id);
  await updateDoc(ref, { usedCount: increment(1) });
}

export async function deleteCoupon(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.COUPONS, id));
}

export async function getCouponById(id: string): Promise<Coupon | null> {
  const ref = doc(db, COLLECTIONS.COUPONS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as Coupon;
}
