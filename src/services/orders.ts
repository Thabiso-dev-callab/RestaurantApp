// src/services/orders.ts
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { Order, OrderStatus } from "../utils/types";

const ORDERS_COLLECTION = "orders";

// ✅ Create order (returns orderId)
export async function createOrder(
  order: Omit<Order, "id" | "status" | "total" | "createdAt">
): Promise<string> {
  // Firestore cannot store undefined — remove undefined fields safely
  const clean = JSON.parse(JSON.stringify(order)) as typeof order;

  const total = Number(clean.subtotal ?? 0) + Number(clean.deliveryFee ?? 0);

  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...clean,
    total,
    status: "pending" as OrderStatus,
    createdAt: Date.now(),
  });

  return docRef.id;
}

// ✅ Admin: Fetch all orders (one-time fetch)
export async function fetchAllOrders(): Promise<Order[]> {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const raw = d.data() as any;
    return {
      id: d.id,
      ...raw,
      status: (raw.status ?? "pending") as OrderStatus,
      createdAt: Number(raw.createdAt ?? Date.now()),
      total: Number(raw.total ?? 0),
      subtotal: Number(raw.subtotal ?? 0),
      deliveryFee: Number(raw.deliveryFee ?? 0),
    } as Order;
  });
}

// ✅ User: Fetch orders for one user (one-time fetch)
export async function fetchUserOrders(userId: string): Promise<Order[]> {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const raw = d.data() as any;
    return {
      id: d.id,
      ...raw,
      status: (raw.status ?? "pending") as OrderStatus,
      createdAt: Number(raw.createdAt ?? Date.now()),
      total: Number(raw.total ?? 0),
      subtotal: Number(raw.subtotal ?? 0),
      deliveryFee: Number(raw.deliveryFee ?? 0),
    } as Order;
  });
}

// ✅ User: Real-time listener (fixes “no orders yet” + loading flicker)
export function listenUserOrders(
  userId: string,
  cb: (orders: Order[]) => void,
  onError?: (err: any) => void
) {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snap) => {
      const data: Order[] = snap.docs.map((d) => {
        const raw = d.data() as any;
        return {
          id: d.id,
          ...raw,
          status: (raw.status ?? "pending") as OrderStatus,
          createdAt: Number(raw.createdAt ?? Date.now()),
          total: Number(raw.total ?? 0),
          subtotal: Number(raw.subtotal ?? 0),
          deliveryFee: Number(raw.deliveryFee ?? 0),
        } as Order;
      });

      cb(data);
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}

// ✅ Optional: Get order details
export async function fetchOrderById(orderId: string): Promise<Order | null> {
  const ref = doc(db, ORDERS_COLLECTION, orderId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const raw = snap.data() as any;
  return {
    id: snap.id,
    ...raw,
    status: (raw.status ?? "pending") as OrderStatus,
    createdAt: Number(raw.createdAt ?? Date.now()),
    total: Number(raw.total ?? 0),
    subtotal: Number(raw.subtotal ?? 0),
    deliveryFee: Number(raw.deliveryFee ?? 0),
  } as Order;
}

// ✅ Admin: Update order status
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), { status });
}
