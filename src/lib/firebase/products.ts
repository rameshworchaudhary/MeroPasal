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

let activeProductsCache: { data: Product[]; timestamp: number } | null = null;
const PRODUCT_CACHE_TTL = 60000; // 60 seconds TTL

export function clearProductCache() {
  activeProductsCache = null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (activeProductsCache && Date.now() - activeProductsCache.timestamp < PRODUCT_CACHE_TTL) {
    const found = activeProductsCache.data.find((p) => p.id === id);
    if (found) return found;
  }
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
  if (activeProductsCache && Date.now() - activeProductsCache.timestamp < PRODUCT_CACHE_TTL) {
    const found = activeProductsCache.data.find((p) => p.slug === slug);
    if (found) return found;
  }
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

export function isProductInCategory(product: Product, categoryIdOrSlug?: string, subCategoryId?: string): boolean {
  if (!product) return false;
  if (!categoryIdOrSlug && !subCategoryId) return true;

  // 1. If explicit subCategoryId filter passed, check subCategoryId exact match
  if (subCategoryId) {
    if (product.subCategoryId === subCategoryId) return true;
    if (product.subCategoryName?.toLowerCase().replace(/\s+/g, "-") === subCategoryId.toLowerCase()) return true;
    return false;
  }

  const cleanId = (categoryIdOrSlug || "").toLowerCase().replace("virtual_", "").trim();

  // 2. Direct Firestore ID matches
  if (product.categoryId === categoryIdOrSlug || product.categoryId === cleanId) {
    return true;
  }
  if (product.subCategoryId === categoryIdOrSlug || product.subCategoryId === cleanId) {
    return true;
  }

  // 3. Category / Subcategory Name / Slug matching rules
  const catName = (product.categoryName || "").toLowerCase();
  const subCatName = (product.subCategoryName || "").toLowerCase();
  const prodName = (product.name || "").toLowerCase();

  switch (cleanId) {
    case "mobiles":
    case "smartphones":
    case "mobile-phones":
    case "sub_phones":
      return (
        product.subCategoryId === "sub_phones" ||
        catName === "mobiles" ||
        catName === "mobile phones" ||
        catName === "smartphones" ||
        subCatName.includes("mobile") ||
        subCatName.includes("smartphone") ||
        subCatName.includes("phone") ||
        prodName.includes("smartphone") ||
        (prodName.includes("mobile") && !prodName.includes("oil") && !prodName.includes("cream"))
      );

    case "electronics":
    case "tech":
      return (
        product.categoryId === "FHVoBenxn5sglbQ1FlkM" ||
        catName.includes("electronic") ||
        catName.includes("tech")
      );

    case "fashion":
    case "apparel":
    case "clothing":
      return (
        product.categoryId === "V1igsyVaIxZcb9YLsaV5" ||
        catName.includes("fashion") ||
        catName.includes("apparel") ||
        catName.includes("clothing")
      );

    case "beauty":
    case "beauty-personal-care":
    case "personal-care":
      return (
        product.categoryId === "dvelBiuo3SFWtklxyWQy" ||
        catName.includes("beauty") ||
        catName.includes("personal care")
      );

    case "home":
    case "home-kitchen":
    case "home-living":
    case "home-decor":
      return (
        product.categoryId === "cefuDmHyonTWwSo0LVHm" ||
        catName.includes("home")
      );

    case "appliances":
    case "home-appliances":
      return (
        catName.includes("appliance") ||
        subCatName.includes("appliance")
      );

    case "kitchen":
    case "kitchenware":
    case "sub_kitchenware":
      return (
        product.subCategoryId === "sub_kitchenware" ||
        catName.includes("kitchen") ||
        subCatName.includes("kitchen")
      );

    case "sports":
    case "sports-outdoors":
    case "sports-fitness":
      return (
        product.categoryId === "B125wGTulQOVMtSVwHdw" ||
        catName.includes("sport")
      );

    case "furniture":
    case "sub_furniture":
      return (
        product.subCategoryId === "sub_furniture" ||
        catName.includes("furniture") ||
        subCatName.includes("furniture")
      );

    case "books":
    case "books-stationery":
      return (
        catName.includes("book") ||
        subCatName.includes("book")
      );

    case "grocery":
    case "groceries":
    case "supermarket":
      return (
        product.categoryId === "YkM5ZYepThTIxQG3bKCr" ||
        catName.includes("grocer")
      );

    case "2-wheelers":
    case "two-wheelers":
    case "bikes":
    case "automotive":
      return (
        catName.includes("2 wheeler") ||
        catName.includes("two wheeler") ||
        catName.includes("bike") ||
        catName.includes("automotive")
      );

    default:
      return catName === cleanId || subCatName === cleanId;
  }
}

export async function getProducts(
  filters: ProductFilters = {},
  pageSize = 24,
  page = 1
): Promise<{
  products: Product[];
  total: number;
  page: number;
  hasMore: boolean;
  lastDoc?: any;
}> {
  // Always query active products with 60s caching
  let allProducts = await getAllActiveProducts();

  // 1. Strict Category & Subcategory Filter
  if (filters.categoryId || filters.subCategoryId) {
    allProducts = allProducts.filter((p) =>
      isProductInCategory(p, filters.categoryId, filters.subCategoryId)
    );
  }

  // 2. Price Filters
  if (filters.minPrice !== undefined) {
    allProducts = allProducts.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    allProducts = allProducts.filter((p) => p.price <= filters.maxPrice!);
  }

  // 3. Brand Filter
  if (filters.brand && filters.brand.length > 0) {
    allProducts = allProducts.filter((p) => p.brand && filters.brand!.includes(p.brand));
  }

  // 4. Rating Filter
  if (filters.rating !== undefined) {
    allProducts = allProducts.filter((p) => p.rating >= filters.rating!);
  }

  // 5. In-Stock Filter
  if (filters.inStock) {
    allProducts = allProducts.filter((p) => p.stock > 0);
  }

  // 6. Search Filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase().trim();
    const searchWords = searchLower.split(/\s+/).filter((w) => w.length > 1);

    const matchedProducts = allProducts.filter((p) => {
      const pName = p.name.toLowerCase();
      const pDesc = (p.description || "").toLowerCase();
      const pBrand = (p.brand || "").toLowerCase();
      const pCategory = (p.categoryName || "").toLowerCase();
      const pSubCategory = (p.subCategoryName || "").toLowerCase();
      const pTags = (p.tags || []).map((t) => t.toLowerCase());

      if (
        pName.includes(searchLower) ||
        pDesc.includes(searchLower) ||
        pBrand.includes(searchLower) ||
        pCategory.includes(searchLower) ||
        pSubCategory.includes(searchLower) ||
        pTags.some((tag) => tag.includes(searchLower))
      ) {
        return true;
      }

      return searchWords.some(
        (word) =>
          pName.includes(word) ||
          pDesc.includes(word) ||
          pBrand.includes(word) ||
          pCategory.includes(word) ||
          pSubCategory.includes(word) ||
          pTags.some((tag) => tag.includes(word))
      );
    });

    if (matchedProducts.length > 0) {
      allProducts = matchedProducts;
    } else {
      allProducts = [];
    }
  }

  // 7. Sorting
  switch (filters.sortBy) {
    case "price-asc":
      allProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      allProducts.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      allProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "popular":
      allProducts.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
      break;
    case "newest":
    default:
      allProducts.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return dateB - dateA;
      });
      break;
  }

  const total = allProducts.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = allProducts.slice(startIndex, startIndex + pageSize);
  const hasMore = startIndex + pageSize < total;

  return {
    products: paginatedProducts,
    total,
    page,
    hasMore,
  };
}

export async function getAllActiveProducts(): Promise<Product[]> {
  if (
    activeProductsCache &&
    Date.now() - activeProductsCache.timestamp < PRODUCT_CACHE_TTL
  ) {
    return activeProductsCache.data;
  }

  try {
    const q = query(collection(db, COLLECTIONS.PRODUCTS), where("isActive", "==", true));
    const snapshot = await getDocs(q);
    const result = snapshot.docs.map(mapProductDoc);
    activeProductsCache = { data: result, timestamp: Date.now() };
    return result;
  } catch (err) {
    console.error("Error fetching active products:", err);
    return activeProductsCache ? activeProductsCache.data : [];
  }
}

export async function getHomepageSections(count = 16): Promise<{
  featured: Product[];
  trending: Product[];
  newArrivals: Product[];
}> {
  try {
    const allActive = await getAllActiveProducts();

    const featured = [...allActive]
      .sort((a, b) => {
        const aBestSeller = !!(a.isBestSeller || a.isFeatured);
        const bBestSeller = !!(b.isBestSeller || b.isFeatured);
        if (aBestSeller && !bBestSeller) return -1;
        if (!aBestSeller && bBestSeller) return 1;
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, count);

    const trending = [...allActive]
      .sort((a, b) => {
        const aTrending = !!a.isTrending;
        const bTrending = !!b.isTrending;
        if (aTrending && !bTrending) return -1;
        if (!aTrending && bTrending) return 1;
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, count);

    const newArrivals = [...allActive]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, count);

    return { featured, trending, newArrivals };
  } catch (err) {
    console.error("Error fetching homepage product sections:", err);
    return { featured: [], trending: [], newArrivals: [] };
  }
}

export async function getFeaturedProducts(count = 16, activeProducts?: Product[]): Promise<Product[]> {
  try {
    const allActive = activeProducts || (await getAllActiveProducts());
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

export async function getTrendingProducts(count = 16, activeProducts?: Product[]): Promise<Product[]> {
  try {
    const allActive = activeProducts || (await getAllActiveProducts());
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
    if (!product?.categoryId) return [];
    // Fast targeted Firestore query by categoryId!
    const q = query(
      collection(db, COLLECTIONS.PRODUCTS),
      where("categoryId", "==", product.categoryId),
      where("isActive", "==", true),
      fbLimit(count + 2)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docs = snapshot.docs.map(mapProductDoc).filter((p) => p.id !== product.id);
      if (docs.length > 0) {
        return docs.slice(0, count);
      }
    }

    // Fallback if categoryId didn't match directly
    const allActive = await getAllActiveProducts();
    return allActive
      .filter((p) => isProductInCategory(p, product.categoryId) && p.id !== product.id)
      .slice(0, count);
  } catch (err) {
    console.error("Error fetching similar products:", err);
    return [];
  }
}

export async function getNewArrivals(count = 100, activeProducts?: Product[]): Promise<Product[]> {
  try {
    const allActive = activeProducts || (await getAllActiveProducts());
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
  clearProductCache();
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
  clearProductCache();
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
  clearProductCache();
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
