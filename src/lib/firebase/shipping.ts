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
  serverTimestamp,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import { COLLECTIONS } from "./collections";
import type { ShippingZone, ShippingZoneFormInput } from "@/lib/types/nepal-address";

function mapZoneDoc(docSnap: QueryDocumentSnapshot<DocumentData>): ShippingZone {
  return { id: docSnap.id, ...docSnap.data() } as ShippingZone;
}

let shippingZonesCache: { data: ShippingZone[]; timestamp: number } | null = null;
const SHIPPING_CACHE_TTL = 120000; // 2 minutes

export function clearShippingCache() {
  shippingZonesCache = null;
}

export async function getAllShippingZones(): Promise<ShippingZone[]> {
  if (
    shippingZonesCache &&
    Date.now() - shippingZonesCache.timestamp < SHIPPING_CACHE_TTL
  ) {
    return shippingZonesCache.data;
  }
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.SHIPPING_ZONES));
    const result = snapshot.docs.map(mapZoneDoc);
    shippingZonesCache = { data: result, timestamp: Date.now() };
    return result;
  } catch (err) {
    console.error("Error fetching shipping zones:", err);
    return shippingZonesCache ? shippingZonesCache.data : [];
  }
}

export async function getActiveShippingZones(): Promise<ShippingZone[]> {
  const allZones = await getAllShippingZones();
  return allZones.filter((z) => z.isActive !== false);
}

export async function calculateShippingCharge(
  district: string,
  cartSubtotal: number
): Promise<{ charge: number; estimatedDays: string; zoneName: string }> {
  const zones = await getActiveShippingZones();

  const matchedZone = zones.find((zone) =>
    zone.districts.some((d) => d.toLowerCase() === district.toLowerCase())
  );

  if (matchedZone) {
    const freeShipping =
      matchedZone.freeShippingThreshold !== undefined &&
      cartSubtotal >= matchedZone.freeShippingThreshold;
    return {
      charge: freeShipping ? 0 : matchedZone.charge,
      estimatedDays: matchedZone.estimatedDays,
      zoneName: matchedZone.name,
    };
  }

  const defaultZone = zones.find((z) => z.name.toLowerCase().includes("rest of nepal"));
  if (defaultZone) {
    const freeShipping =
      defaultZone.freeShippingThreshold !== undefined &&
      cartSubtotal >= defaultZone.freeShippingThreshold;
    return {
      charge: freeShipping ? 0 : defaultZone.charge,
      estimatedDays: defaultZone.estimatedDays,
      zoneName: defaultZone.name,
    };
  }

  return { charge: 150, estimatedDays: "3-7 days", zoneName: "Rest of Nepal" };
}

export async function createShippingZone(input: ShippingZoneFormInput): Promise<string> {
  clearShippingCache();
  const docRef = await addDoc(collection(db, COLLECTIONS.SHIPPING_ZONES), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateShippingZone(id: string, input: Partial<ShippingZoneFormInput>): Promise<void> {
  clearShippingCache();
  const ref = doc(db, COLLECTIONS.SHIPPING_ZONES, id);
  await updateDoc(ref, { ...input, updatedAt: serverTimestamp() });
}

export async function deleteShippingZone(id: string): Promise<void> {
  clearShippingCache();
  await deleteDoc(doc(db, COLLECTIONS.SHIPPING_ZONES, id));
}

export async function getShippingZoneById(id: string): Promise<ShippingZone | null> {
  const ref = doc(db, COLLECTIONS.SHIPPING_ZONES, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ShippingZone;
}
