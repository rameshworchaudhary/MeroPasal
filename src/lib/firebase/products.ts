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
  limit as fbLimit,
  startAfter,
  serverTimestamp,
  increment,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import { COLLECTIONS } from "./collections";
import type { Product, ProductFormInput, ProductFilters } from "@/lib/types/product";

function mapProductDoc(docSnap: QueryDocumentSnapshot<DocumentData>): Product {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as Product;
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const ref = doc(db, COLLECTIONS.PRODUCTS, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      id: snap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Product;
  } catch (err) {
    console.error("Error fetching product by id:", err);
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const q = query(
      collection(db, COLLECTIONS.PRODUCTS),
      where("slug", "==", slug),
      fbLimit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return mapProductDoc(snapshot.docs[0]);
  } catch (err) {
    console.error("Error fetching product by slug:", err);
    return null;
  }
}

export async function getProducts(
  filters: ProductFilters = {},
  pageSize = 20,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ products: Product[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  const constraints = [where("isActive", "==", true)];

  if (filters.categoryId) {
    constraints.push(where("categoryId", "==", filters.categoryId));
  }
  if (filters.subCategoryId) {
    constraints.push(where("subCategoryId", "==", filters.subCategoryId));
  }

  let sortField = "createdAt";
  let sortDir: "asc" | "desc" = "desc";

  switch (filters.sortBy) {
    case "price-asc":
      sortField = "price";
      sortDir = "asc";
      break;
    case "price-desc":
      sortField = "price";
      sortDir = "desc";
      break;
    case "rating":
      sortField = "rating";
      sortDir = "desc";
      break;
    case "popular":
      sortField = "soldCount";
      sortDir = "desc";
      break;
    default:
      sortField = "createdAt";
      sortDir = "desc";
  }

  let q = query(
    collection(db, COLLECTIONS.PRODUCTS),
    ...constraints,
    orderBy(sortField, sortDir),
    fbLimit(pageSize)
  );

  if (lastDoc) {
    q = query(
      collection(db, COLLECTIONS.PRODUCTS),
      ...constraints,
      orderBy(sortField, sortDir),
      startAfter(lastDoc),
      fbLimit(pageSize)
    );
  }

  const snapshot = await getDocs(q);
  let products = snapshot.docs.map(mapProductDoc);

  if (filters.minPrice !== undefined) {
    products = products.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    products = products.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.brand && filters.brand.length > 0) {
    products = products.filter((p) => p.brand && filters.brand!.includes(p.brand));
  }
  if (filters.rating !== undefined) {
    products = products.filter((p) => p.rating >= filters.rating!);
  }
  if (filters.inStock) {
    products = products.filter((p) => p.stock > 0);
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        (p.brand && p.brand.toLowerCase().includes(searchLower))
    );
  }

  const newLastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

  return { products, lastDoc: newLastDoc };
}

export async function getAllActiveProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, COLLECTIONS.PRODUCTS), where("isActive", "==", true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapProductDoc);
  } catch (err) {
    console.error("Error fetching active products:", err);
    return [];
  }
}

export async function getFeaturedProducts(count = 8): Promise<Product[]> {
  try {
    const allActive = await getAllActiveProducts();
    
    // Sort logic:
    // 1. isBestSeller/isFeatured = true products appear first
    // 2. Newest Best Seller products appear first (latest updatedAt/createdAt)
    // 3. Remaining products appear below
    const sorted = [...allActive].sort((a, b) => {
      const aBestSeller = !!(a.isBestSeller || a.isFeatured);
      const bBestSeller = !!(b.isBestSeller || b.isFeatured);

      if (aBestSeller && !bBestSeller) return -1;
      if (!aBestSeller && bBestSeller) return 1;

      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return sorted.slice(0, count);
  } catch (err) {
    console.error("Error fetching featured/best-seller products:", err);
    return [];
  }
}

export async function getTrendingProducts(count = 8): Promise<Product[]> {
  try {
    const allActive = await getAllActiveProducts();

    // Sort logic:
    // 1. isTrending = true products appear first
    // 2. Newest trending products appear first (latest updatedAt/createdAt)
    // 3. Remaining products appear below
    const sorted = [...allActive].sort((a, b) => {
      const aTrending = !!a.isTrending;
      const bTrending = !!b.isTrending;

      if (aTrending && !bTrending) return -1;
      if (!aTrending && bTrending) return 1;

      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return sorted.slice(0, count);
  } catch (err) {
    console.error("Error fetching trending products:", err);
    return [];
  }
}

export async function getSimilarProducts(product: Product, count = 8): Promise<Product[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.PRODUCTS),
      where("isActive", "==", true),
      where("categoryId", "==", product.categoryId),
      fbLimit(count + 1)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(mapProductDoc)
      .filter((p) => p.id !== product.id)
      .slice(0, count);
  } catch (err) {
    console.error("Error fetching similar products:", err);
    return [];
  }
}

export async function getNewArrivals(count = 8): Promise<Product[]> {
  try {
    const allActive = await getAllActiveProducts();
    const sorted = [...allActive].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
      const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
      return dateB - dateA;
    });
    return sorted.slice(0, count);
  } catch (err) {
    console.error("Error fetching new arrivals:", err);
    return [];
  }
}

export async function getLowStockProducts(): Promise<Product[]> {
  const snapshot = await getDocs(
    query(collection(db, COLLECTIONS.PRODUCTS), where("isActive", "==", true))
  );
  return snapshot.docs
    .map(mapProductDoc)
    .filter((p) => p.stock <= p.lowStockThreshold && p.stock >= 0);
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  const snapshot = await getDocs(
    query(collection(db, COLLECTIONS.PRODUCTS), orderBy("createdAt", "desc"))
  );
  return snapshot.docs.map(mapProductDoc);
}

function removeUndefinedFields<T extends Record<string, any>>(obj: T): T {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as T;
}

export async function createProduct(input: ProductFormInput): Promise<string> {
  let sellerName = input.sellerName;

  if (input.sellerId && !sellerName) {
    try {
      const sellerSnap = await getDoc(doc(db, COLLECTIONS.USERS, input.sellerId));
      if (sellerSnap.exists()) {
        const sData = sellerSnap.data();
        sellerName = sData?.sellerProfile?.shopName || sData?.displayName || "Store";
      }
    } catch (e) {
      console.warn("Could not fetch seller name:", e);
    }
  }

  const rawPayload = {
    ...input,
    ...(sellerName ? { sellerName } : {}),
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    viewCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const payload = removeUndefinedFields(rawPayload);

  const docRef = await addDoc(collection(db, COLLECTIONS.PRODUCTS), payload);

  if (input.sellerId) {
    try {
      const sellerRef = doc(db, COLLECTIONS.USERS, input.sellerId);
      const sellerSnap = await getDoc(sellerRef);
      if (sellerSnap.exists()) {
        const sData = sellerSnap.data();
        if (sData?.sellerProfile) {
          await updateDoc(sellerRef, {
            "sellerProfile.totalProducts": increment(1),
            updatedAt: serverTimestamp(),
          });
        }
      }
    } catch (err) {
      console.warn("Error updating seller totalProducts in createProduct:", err);
    }
  }

  return docRef.id;
}

export async function updateProduct(id: string, input: Partial<ProductFormInput>): Promise<void> {
  const ref = doc(db, COLLECTIONS.PRODUCTS, id);
  const oldSnap = await getDoc(ref);
  const oldSellerId = oldSnap.exists() ? oldSnap.data()?.sellerId : undefined;

  const payload = removeUndefinedFields({
    ...input,
    updatedAt: serverTimestamp(),
  });

  await updateDoc(ref, payload);

  const newSellerId = input.sellerId;
  if (newSellerId !== undefined && oldSellerId !== newSellerId) {
    if (oldSellerId) {
      try {
        await updateDoc(doc(db, COLLECTIONS.USERS, oldSellerId), {
          "sellerProfile.totalProducts": increment(-1),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn("Error decrementing old seller totalProducts:", err);
      }
    }
    if (newSellerId) {
      try {
        await updateDoc(doc(db, COLLECTIONS.USERS, newSellerId), {
          "sellerProfile.totalProducts": increment(1),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn("Error incrementing new seller totalProducts:", err);
      }
    }
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const ref = doc(db, COLLECTIONS.PRODUCTS, id);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    if (data.sellerId) {
      try {
        await updateDoc(doc(db, COLLECTIONS.USERS, data.sellerId), {
          "sellerProfile.totalProducts": increment(-1),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn("Error decrementing seller totalProducts on delete:", err);
      }
    }
  }
  await deleteDoc(ref);
}

export async function incrementProductViewCount(id: string): Promise<void> {
  const ref = doc(db, COLLECTIONS.PRODUCTS, id);
  await updateDoc(ref, { viewCount: increment(1) });
}

export async function decrementStockAndIncrementSold(id: string, quantity: number): Promise<void> {
  const ref = doc(db, COLLECTIONS.PRODUCTS, id);
  await updateDoc(ref, {
    stock: increment(-quantity),
    soldCount: increment(quantity),
  });
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];

  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += 30) {
    chunks.push(ids.slice(i, i + 30));
  }

  const results: Product[] = [];
  for (const chunk of chunks) {
    const q = query(collection(db, COLLECTIONS.PRODUCTS), where("__name__", "in", chunk));
    const snapshot = await getDocs(q);
    results.push(...snapshot.docs.map(mapProductDoc));
  }

  return results;
}
