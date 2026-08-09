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

let allBannersCache: { data: Banner[]; timestamp: number } | null = null;
const BANNER_CACHE_TTL = 60000; // 60 seconds

export function clearBannerCache() {
  allBannersCache = null;
}

export async function getAllBanners(): Promise<Banner[]> {
  if (
    allBannersCache &&
    Date.now() - allBannersCache.timestamp < BANNER_CACHE_TTL
  ) {
    return allBannersCache.data;
  }

  try {
    const q = query(collection(db, COLLECTIONS.BANNERS), orderBy("displayOrder", "asc"));
    const snapshot = await getDocs(q);
    const banners = snapshot.docs.map(mapBannerDoc);
    allBannersCache = { data: banners, timestamp: Date.now() };
    return banners;
  } catch (err) {
    console.error("Error fetching all banners:", err);
    return allBannersCache ? allBannersCache.data : [];
  }
}

export async function getActiveBannersByPosition(position: Banner["position"]): Promise<Banner[]> {
  try {
    const allBanners = await getAllBanners();
    const now = new Date();
    return allBanners.filter((b) => {
      if (!b.isActive) return false;
      if (b.position !== position) return false;
      if (b.startDate && new Date(b.startDate) > now) return false;
      if (b.endDate && new Date(b.endDate) < now) return false;
      return true;
    });
  } catch (err) {
    console.error("Error fetching active banners:", err);
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
  clearBannerCache();
  const docRef = await addDoc(collection(db, COLLECTIONS.BANNERS), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateBanner(id: string, input: Partial<BannerFormInput>): Promise<void> {
  clearBannerCache();
  const ref = doc(db, COLLECTIONS.BANNERS, id);
  await updateDoc(ref, { ...input, updatedAt: serverTimestamp() });
}

export async function deleteBanner(id: string): Promise<void> {
  clearBannerCache();
  await deleteDoc(doc(db, COLLECTIONS.BANNERS, id));
}
