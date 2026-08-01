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
  limit as fbLimit,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import { COLLECTIONS } from "./collections";
import type { Order, CreateOrderInput, OrderStatus, PaymentStatus } from "@/lib/types/order";
import { generateOrderId } from "@/lib/utils";
import { decrementStockAndIncrementSold } from "./products";

function mapOrderDoc(docSnap: QueryDocumentSnapshot<DocumentData>): Order {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as Order;
}

// Removes undefined values recursively so Firestore doesn't throw
function removeUndefined(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  }
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefined(v)])
    );
  }
  return obj;
}

export async function createOrder(input: CreateOrderInput): Promise<{ id: string; orderNumber: string }> {
  const orderNumber = generateOrderId();
  const now = new Date().toISOString();

  // Clean input — remove any undefined fields before sending to Firestore
  const cleanInput = removeUndefined(input) as CreateOrderInput;

  const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), {
    ...cleanInput,
    orderNumber,
    paymentStatus: "pending" as const,
    status: "pending" as const,
    statusHistory: [
      {
        status: "pending",
        timestamp: now,
        note: "Order placed successfully",
      },
    ],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await Promise.all(
    input.items.map((item) => decrementStockAndIncrementSold(item.productId, item.quantity))
  );

  return { id: docRef.id, orderNumber };
}

export async function getOrderById(id: string): Promise<Order | null> {
  const ref = doc(db, COLLECTIONS.ORDERS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as Order;
}

export async function getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    where("orderNumber", "==", orderNumber),
    fbLimit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return mapOrderDoc(snapshot.docs[0]);
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapOrderDoc);
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, COLLECTIONS.ORDERS), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapOrderDoc);
}

export async function getRecentOrders(count = 10): Promise<Order[]> {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    orderBy("createdAt", "desc"),
    fbLimit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapOrderDoc);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string
): Promise<void> {
  const ref = doc(db, COLLECTIONS.ORDERS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Order not found");

  const data = snap.data();
  const history = data.statusHistory || [];

  await updateDoc(ref, {
    status,
    statusHistory: [
      ...history,
      {
        status,
        timestamp: new Date().toISOString(),
        note: note || "",
      },
    ],
    updatedAt: serverTimestamp(),
  });
}

export async function updateOrderPaymentStatus(
  id: string,
  paymentStatus: PaymentStatus,
  transactionId?: string
): Promise<void> {
  const ref = doc(db, COLLECTIONS.ORDERS, id);
  await updateDoc(ref, {
    paymentStatus,
    ...(transactionId ? { paymentTransactionId: transactionId } : {}),
    updatedAt: serverTimestamp(),
  });
}