import React, { createContext, useContext, useMemo, useReducer } from "react";
import { CartItem, CartSelection, MenuItem } from "../utils/types";

type CartState = {
  items: CartItem[];
};

type CartContextValue = {
  items: CartItem[];
  subtotal: number;

  addItem: (item: MenuItem, selection?: CartSelection, quantity?: number) => void;
  updateQty: (cartId: string, quantity: number) => void;
  removeItem: (cartId: string) => void;
  clearCart: () => void;

  // ✅ required by EditCartItemScreen
  editItem: (cartId: string, selection: CartSelection, quantity: number) => void;
};

const CartContext = createContext<CartContextValue>({} as any);

function makeCartId(itemId: string) {
  return `${itemId}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// ✅ Safe helper: supports string OR {label, addPrice}
function getAddPrice(x: any): number {
  if (!x) return 0;
  if (typeof x === "string") return 0;
  const n = Number(x.addPrice ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function calcExtrasTotal(selection?: CartSelection): number {
  if (!selection) return 0;

  const extras = selection.extras ?? [];
  // drink is string in your types -> no price
  return extras.reduce((sum, e) => sum + getAddPrice(e), 0);
}

function calcLineTotal(item: MenuItem, selection: CartSelection | undefined, quantity: number) {
  const qty = Math.max(1, quantity);
  const extrasTotal = calcExtrasTotal(selection);
  return (item.price + extrasTotal) * qty;
}

type Action =
  | { type: "ADD"; payload: CartItem }
  | { type: "QTY"; payload: { cartId: string; quantity: number } }
  | { type: "REMOVE"; payload: { cartId: string } }
  | { type: "CLEAR" }
  | { type: "EDIT"; payload: { cartId: string; selection: CartSelection; quantity: number } };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD":
      return { ...state, items: [action.payload, ...state.items] };

    case "QTY":
      return {
        ...state,
        items: state.items.map((ci) => {
          if (ci.cartId !== action.payload.cartId) return ci;
          const qty = Math.max(1, action.payload.quantity);
          return {
            ...ci,
            quantity: qty,
            lineTotal: calcLineTotal(ci.item, ci.selection, qty),
          };
        }),
      };

    case "EDIT":
      return {
        ...state,
        items: state.items.map((ci) => {
          if (ci.cartId !== action.payload.cartId) return ci;

          const qty = Math.max(1, action.payload.quantity);
          const selection = action.payload.selection;

          const extrasTotal = calcExtrasTotal(selection);
          const lineTotal = calcLineTotal(ci.item, selection, qty);

          return { ...ci, selection, extrasTotal, quantity: qty, lineTotal };
        }),
      };

    case "REMOVE":
      return { ...state, items: state.items.filter((ci) => ci.cartId !== action.payload.cartId) };

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  const subtotal = useMemo(() => state.items.reduce((sum, i) => sum + i.lineTotal, 0), [state.items]);

  const addItem = (item: MenuItem, selection?: CartSelection, quantity: number = 1) => {
    const qty = Math.max(1, quantity);

    const extrasTotal = calcExtrasTotal(selection);
    const lineTotal = calcLineTotal(item, selection, qty);

    const cartItem: CartItem = {
      cartId: makeCartId(item.id),
      item,
      selection,
      quantity: qty,
      extrasTotal,
      lineTotal,
    };

    dispatch({ type: "ADD", payload: cartItem });
  };

  const updateQty = (cartId: string, quantity: number) => {
    dispatch({ type: "QTY", payload: { cartId, quantity } });
  };

  const editItem = (cartId: string, selection: CartSelection, quantity: number) => {
    dispatch({ type: "EDIT", payload: { cartId, selection, quantity } });
  };

  const removeItem = (cartId: string) => dispatch({ type: "REMOVE", payload: { cartId } });

  const clearCart = () => dispatch({ type: "CLEAR" });

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      subtotal,
      addItem,
      updateQty,
      editItem,
      removeItem,
      clearCart,
    }),
    [state.items, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
