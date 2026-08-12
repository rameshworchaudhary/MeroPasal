import { cache } from "react";
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

function mapCategoryDoc(docSnap: QueryDocumentSnapshot<DocumentData> | DocumentData): Category {
  const data = typeof (docSnap as QueryDocumentSnapshot<DocumentData>).data === "function" 
    ? (docSnap as QueryDocumentSnapshot<DocumentData>).data() 
    : (docSnap as DocumentData);
  const id = docSnap.id || data.id || "";

  const createdAtStr = data.createdAt?.toDate?.()?.toISOString() 
    || (typeof data.createdAt === "string" ? data.createdAt : undefined)
    || new Date().toISOString();

  const updatedAtStr = data.updatedAt?.toDate?.()?.toISOString() 
    || (typeof data.updatedAt === "string" ? data.updatedAt : undefined)
    || new Date().toISOString();

  return {
    id,
    ...data,
    createdAt: createdAtStr,
    updatedAt: updatedAtStr,
  } as Category;
}

let activeCategoriesCache: { data: Category[]; timestamp: number } | null = null;
let allCategoriesCache: { data: Category[]; timestamp: number } | null = null;
const CATEGORY_CACHE_TTL = 60000; // 60 seconds

export function clearCategoryCache() {
  activeCategoriesCache = null;
  allCategoriesCache = null;
}

export const getActiveCategories = cache(async function getActiveCategories(): Promise<Category[]> {
  if (
    activeCategoriesCache &&
    Date.now() - activeCategoriesCache.timestamp < CATEGORY_CACHE_TTL
  ) {
    return activeCategoriesCache.data;
  }

  try {
    const q = query(
      collection(db, COLLECTIONS.CATEGORIES),
      where("isActive", "==", true),
      orderBy("displayOrder", "asc")
    );
    const snapshot = await getDocs(q);
    const result = snapshot.docs.map(mapCategoryDoc);
    activeCategoriesCache = { data: result, timestamp: Date.now() };
    return result;
  } catch (err) {
    console.error("Error fetching active categories:", err);
    return activeCategoriesCache ? activeCategoriesCache.data : [];
  }
});

export const getAllCategories = cache(async function getAllCategories(): Promise<Category[]> {
  if (
    allCategoriesCache &&
    Date.now() - allCategoriesCache.timestamp < CATEGORY_CACHE_TTL
  ) {
    return allCategoriesCache.data;
  }

  try {
    const q = query(collection(db, COLLECTIONS.CATEGORIES), orderBy("displayOrder", "asc"));
    const snapshot = await getDocs(q);
    const result = snapshot.docs.map(mapCategoryDoc);
    allCategoriesCache = { data: result, timestamp: Date.now() };
    return result;
  } catch (err) {
    console.error("Error fetching all categories:", err);
    return allCategoriesCache ? allCategoriesCache.data : [];
  }
});

export const getCategoryBySlug = cache(async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    // 1. Try exact match
    let q = query(collection(db, COLLECTIONS.CATEGORIES), where("slug", "==", slug));
    let snapshot = await getDocs(q);
    if (!snapshot.empty) return mapCategoryDoc(snapshot.docs[0]);

    // 2. Check known aliases
    const aliases: Record<string, string[]> = {
      mobiles: ["smartphones", "mobile-phones", "phones"],
      electronics: ["electronics-gadgets", "tech"],
      fashion: ["apparel", "clothing"],
      beauty: ["beauty-personal-care", "beauty-care", "personal-care"],
      home: ["home-kitchen", "home-decor", "home-living"],
      appliances: ["home-appliances", "appliances-electronics"],
      kitchen: ["kitchenware", "home-kitchen"],
      sports: ["sports-outdoors", "sports-fitness"],
      furniture: ["home-furniture"],
      books: ["books-stationery"],
      grocery: ["groceries", "supermarket"],
      "2-wheelers": ["two-wheelers", "automotive", "vehicles", "bikes"],
    };

    const targetAliases = aliases[slug] || [];
    for (const alias of targetAliases) {
      q = query(collection(db, COLLECTIONS.CATEGORIES), where("slug", "==", alias));
      snapshot = await getDocs(q);
      if (!snapshot.empty) return mapCategoryDoc(snapshot.docs[0]);
    }

    // 3. Fallback: Match by category name
    const allCats = await getActiveCategories();
    const slugLower = slug.toLowerCase().replace(/-/g, " ");
    const matched = allCats.find((c) => {
      const nameLower = c.name.toLowerCase();
      const catSlugLower = c.slug.toLowerCase();
      return (
        catSlugLower.includes(slug) ||
        slug.includes(catSlugLower) ||
        nameLower.includes(slugLower) ||
        slugLower.includes(nameLower)
      );
    });

    if (matched) return matched;

    // 4. Synthetic fallback category for shortcuts not yet present in Firestore
    const categoryNameMap: Record<string, string> = {
      mobiles: "Mobiles",
      electronics: "Electronics",
      fashion: "Fashion",
      beauty: "Beauty & Personal Care",
      home: "Home & Living",
      appliances: "Appliances",
      kitchen: "Kitchen & Dining",
      sports: "Sports & Outdoors",
      furniture: "Furniture",
      books: "Books & Stationery",
      grocery: "Grocery",
      "2-wheelers": "2 Wheelers",
    };

    if (categoryNameMap[slug]) {
      return {
        id: `virtual_${slug}`,
        name: categoryNameMap[slug],
        slug: slug,
        description: `Explore all ${categoryNameMap[slug]} products on NexShop`,
        image: "/images/placeholder.jpg",
        icon: "🛍️",
        subCategories: [],
        isActive: true,
        displayOrder: 99,
        productCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return null;
  } catch (err) {
    console.error("Error fetching category by slug:", err);
    return null;
  }
});

export const getCategoryById = cache(async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const ref = doc(db, COLLECTIONS.CATEGORIES, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return mapCategoryDoc(snap);
  } catch (err) {
    console.error("Error fetching category by id:", err);
    return null;
  }
});

export async function createCategory(input: CategoryFormInput): Promise<string> {
  clearCategoryCache();
  const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIES), {
    ...input,
    productCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateCategory(id: string, input: Partial<CategoryFormInput>): Promise<void> {
  clearCategoryCache();
  const ref = doc(db, COLLECTIONS.CATEGORIES, id);
  await updateDoc(ref, {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  clearCategoryCache();
  await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id));
}
