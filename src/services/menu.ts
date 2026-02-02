import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { MenuCategory, MenuItem } from "../utils/types";

const MENU_COLLECTION = "menu";

type MenuInput = Omit<MenuItem, "id">;

export async function fetchMenu(): Promise<MenuItem[]> {
  const q = query(collection(db, MENU_COLLECTION), orderBy("name", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MenuItem, "id">) }));
}

export function filterByCategory(items: MenuItem[], category: MenuCategory) {
  return items.filter((i) => i.category === category && i.isAvailable);
}

export async function addMenuItem(input: MenuInput) {
  // Firestore cannot store undefined
  const clean = JSON.parse(JSON.stringify(input));
  const ref = await addDoc(collection(db, MENU_COLLECTION), clean);
  return ref.id;
}

export async function updateMenuItem(id: string, updates: Partial<MenuInput>) {
  const clean = JSON.parse(JSON.stringify(updates));
  await updateDoc(doc(db, MENU_COLLECTION, id), clean);
}

export async function deleteMenuItem(id: string) {
  await deleteDoc(doc(db, MENU_COLLECTION, id));
}
