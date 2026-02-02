export type UserRole = "user" | "admin";

export type Card = {
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
};

export type AppUser = {
  id: string;
  role: UserRole;

  email: string;

  name: string;
  surname: string;
  phone: string;
  address: string;

  card: Card;
};

export type MenuCategory = "Burgers" | "Mains" | "Starters" | "Beverages";

export type MenuOption = {
  label: string;
  value: string;
  addPrice?: number;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: MenuCategory;
  isAvailable: boolean;

  options?: {
    sides?: MenuOption[];
    drinks?: MenuOption[];
    extras?: { label: string; addPrice: number }[];
    removables?: { label: string }[];
  };
};

// ✅ Allow strings OR priced objects
export type CartExtra = string | { label: string; addPrice: number };

export type CartSelection = {
  sides?: string[];
  drink?: string;
  extras?: CartExtra[];
  removables?: string[];
};

export type CartItem = {
  cartId: string;

  item: MenuItem;

  quantity: number;
  selection?: CartSelection;

  extrasTotal: number;
  lineTotal: number;
};

export type OrderStatus = "pending" | "preparing" | "delivered";

export type Order = {
  id: string;
  userId: string;

  customer: {
    name: string;
    surname: string;
    phone: string;
    email: string;
  };

  address: string;

  cartItems: CartItem[];

  subtotal: number;
  deliveryFee: number;
  total: number;

  status: OrderStatus;
  createdAt: number;
};
