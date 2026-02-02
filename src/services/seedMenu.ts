import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { MenuItem } from "../utils/types";

const MENU_COLLECTION = "menu";

const DEMO_MENU: Omit<MenuItem, "id">[] = [
  {
    name: "Classic Beef Burger",
    description: "Juicy beef patty with cheese and sauce",
    price: 89,
    imageUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    category: "Burgers",
    isAvailable: true,
  },
  {
    name: "Chicken Burger",
    description: "Crispy chicken breast with mayo",
    price: 79,
    imageUrl:
      "https://images.unsplash.com/photo-1606755962773-d324e9a13086?auto=format&fit=crop&w=800&q=80",
    category: "Burgers",
    isAvailable: true,
  },
  {
    name: "Fries",
    description: "Golden crispy fries",
    price: 29,
    imageUrl:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80",
    category: "Starters",
    isAvailable: true,
  },
];

export async function seedMenuIfEmpty(): Promise<void> {
  const snap = await getDocs(collection(db, MENU_COLLECTION));
  if (!snap.empty) return;

  for (const item of DEMO_MENU) {
    await addDoc(collection(db, MENU_COLLECTION), item);
  }
}
