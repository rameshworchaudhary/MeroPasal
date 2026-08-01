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
import type { Category, CategoryFormInput } from "@/lib/types/category";

function mapCategoryDoc(docSnap: QueryDocumentSnapshot<DocumentData>): Category {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as Category;
}

export async function getActiveCategories(): Promise<Category[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.CATEGORIES),
      where("isActive", "==", true),
      orderBy("displayOrder", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapCategoryDoc);
  } catch (err) {
    console.error("Error fetching active categories:", err);
    return [];
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const q = query(collection(db, COLLECTIONS.CATEGORIES), orderBy("displayOrder", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapCategoryDoc);
  } catch (err) {
    console.error("Error fetching all categories:", err);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const q = query(collection(db, COLLECTIONS.CATEGORIES), where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return mapCategoryDoc(snapshot.docs[0]);
  } catch (err) {
    console.error("Error fetching category by slug:", err);
    return null;
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const ref = doc(db, COLLECTIONS.CATEGORIES, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      id: snap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Category;
  } catch (err) {
    console.error("Error fetching category by id:", err);
    return null;
  }
}

export async function createCategory(input: CategoryFormInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIES), {
    ...input,
    productCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateCategory(id: string, input: Partial<CategoryFormInput>): Promise<void> {
  const ref = doc(db, COLLECTIONS.CATEGORIES, id);
  await updateDoc(ref, {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id));
}
