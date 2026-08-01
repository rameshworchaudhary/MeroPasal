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
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import { COLLECTIONS } from "./collections";
import type { Banner, BannerFormInput } from "@/lib/types/banner";

function mapBannerDoc(docSnap: QueryDocumentSnapshot<DocumentData>): Banner {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as Banner;
}

export async function getActiveBannersByPosition(position: Banner["position"]): Promise<Banner[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.BANNERS),
      where("isActive", "==", true),
      where("position", "==", position),
      orderBy("displayOrder", "asc")
    );
    const snapshot = await getDocs(q);
    const banners = snapshot.docs.map(mapBannerDoc);
    const now = new Date();
    return banners.filter((b) => {
      if (b.startDate && new Date(b.startDate) > now) return false;
      if (b.endDate && new Date(b.endDate) < now) return false;
      return true;
    });
  } catch (err) {
    console.error("Error fetching active banners:", err);
    return [];
  }
}

export async function getAllBanners(): Promise<Banner[]> {
  try {
    const q = query(collection(db, COLLECTIONS.BANNERS), orderBy("displayOrder", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapBannerDoc);
  } catch (err) {
    console.error("Error fetching all banners:", err);
    return [];
  }
}

export async function getBannerById(id: string): Promise<Banner | null> {
  try {
    const ref = doc(db, COLLECTIONS.BANNERS, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      id: snap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Banner;
  } catch (err) {
    console.error("Error fetching banner by id:", err);
    return null;
  }
}

export async function createBanner(input: BannerFormInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.BANNERS), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateBanner(id: string, input: Partial<BannerFormInput>): Promise<void> {
  const ref = doc(db, COLLECTIONS.BANNERS, id);
  await updateDoc(ref, { ...input, updatedAt: serverTimestamp() });
}

export async function deleteBanner(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.BANNERS, id));
}
