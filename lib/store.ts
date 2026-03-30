"use client";

import { useSyncExternalStore, useCallback } from "react";
import { products as seedProducts, type Product } from "@/lib/data/products";
import { orders as seedOrders, type Order, type OrderStatus } from "@/lib/data/orders";
import { users, type User } from "@/lib/data/users";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CartItem = {
  productId: string;
  quantity: number;
};

export type AuthState = {
  user: User;
  token: string;
  expiresAt: number;
} | null;

type StoreState = {
  cart: CartItem[];
  auth: AuthState;
  products: Product[];
  orders: Order[];
};

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------

const STORAGE_KEY = "flowguard_demo_store";

// ---------------------------------------------------------------------------
// Default state
// ---------------------------------------------------------------------------

function defaultState(): StoreState {
  return {
    cart: [],
    auth: null,
    products: seedProducts,
    orders: seedOrders,
  };
}

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

function loadState(): StoreState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<StoreState>;
    return {
      cart: parsed.cart ?? [],
      auth: parsed.auth ?? null,
      products: parsed.products ?? seedProducts,
      orders: parsed.orders ?? seedOrders,
    };
  } catch {
    return defaultState();
  }
}

function saveState(state: StoreState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded or private browsing — silently ignore.
  }
}

// ---------------------------------------------------------------------------
// Store implementation
// ---------------------------------------------------------------------------

let state: StoreState = loadState();
const listeners = new Set<() => void>();

function getSnapshot(): StoreState {
  return state;
}

function getServerSnapshot(): StoreState {
  return defaultState();
}

function setState(updater: (prev: StoreState) => StoreState): void {
  state = updater(state);
  saveState(state);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ---------------------------------------------------------------------------
// useCart
// ---------------------------------------------------------------------------

export type UseCartReturn = {
  items: CartItem[];
  addItem: (productId: string, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

export function useCart(): UseCartReturn {
  const { cart, products } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const addItem = useCallback((productId: string, qty: number = 1) => {
    setState((prev) => {
      const existing = prev.cart.find((i) => i.productId === productId);
      if (existing) {
        return {
          ...prev,
          cart: prev.cart.map((i) =>
            i.productId === productId
              ? { ...i, quantity: i.quantity + qty }
              : i
          ),
        };
      }
      return { ...prev, cart: [...prev.cart, { productId, quantity: qty }] };
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.filter((i) => i.productId !== productId),
    }));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setState((prev) => ({
        ...prev,
        cart: prev.cart.filter((i) => i.productId !== productId),
      }));
      return;
    }
    setState((prev) => ({
      ...prev,
      cart: prev.cart.map((i) =>
        i.productId === productId ? { ...i, quantity: qty } : i
      ),
    }));
  }, []);

  const clearCart = useCallback(() => {
    setState((prev) => ({ ...prev, cart: [] }));
  }, []);

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const totalPrice = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return { items: cart, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice };
}

// ---------------------------------------------------------------------------
// useAuth
// ---------------------------------------------------------------------------

export type UseAuthReturn = {
  user: User | null;
  isAuthenticated: boolean;
  isExpired: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  checkAuth: () => boolean;
};

export function useAuth(): UseAuthReturn {
  const { auth } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const login = useCallback((email: string, password: string): boolean => {
    const match = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!match) return false;

    const token = `mock-jwt-${match.id}-${Date.now()}`;
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes

    setState((prev) => ({
      ...prev,
      auth: { user: match, token, expiresAt },
    }));
    return true;
  }, []);

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, auth: null }));
  }, []);

  const checkAuth = useCallback((): boolean => {
    const current = getSnapshot().auth;
    if (!current) return false;
    if (Date.now() > current.expiresAt) {
      setState((prev) => ({ ...prev, auth: null }));
      return false;
    }
    return true;
  }, []);

  const isExpired = auth !== null && Date.now() > auth.expiresAt;
  const isAuthenticated = auth !== null && !isExpired;

  return {
    user: auth?.user ?? null,
    isAuthenticated,
    isExpired,
    login,
    logout,
    checkAuth,
  };
}

// ---------------------------------------------------------------------------
// useProducts
// ---------------------------------------------------------------------------

export type NewProduct = Omit<Product, "id" | "createdAt">;

export type UseProductsReturn = {
  products: Product[];
  addProduct: (p: NewProduct) => Product;
  updateProduct: (id: string, updates: Partial<NewProduct>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
};

export function useProducts(): UseProductsReturn {
  const { products } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const addProduct = useCallback((p: NewProduct): Product => {
    const newProduct: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, products: [...prev.products, newProduct] }));
    return newProduct;
  }, []);

  const updateProduct = useCallback(
    (id: string, updates: Partial<NewProduct>) => {
      setState((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      }));
    },
    []
  );

  const deleteProduct = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
      // Also clean up any cart items referencing the deleted product.
      cart: prev.cart.filter((i) => i.productId !== id),
    }));
  }, []);

  const getProduct = useCallback(
    (id: string): Product | undefined => {
      return products.find((p) => p.id === id);
    },
    [products]
  );

  return { products, addProduct, updateProduct, deleteProduct, getProduct };
}

// ---------------------------------------------------------------------------
// useOrders
// ---------------------------------------------------------------------------

export type UseOrdersReturn = {
  orders: Order[];
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  addOrderNote: (id: string, note: string) => void;
  getOrder: (id: string) => Order | undefined;
};

export function useOrders(): UseOrdersReturn {
  const { orders } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const updateOrderStatus = useCallback(
    (id: string, status: OrderStatus) => {
      setState((prev) => ({
        ...prev,
        orders: prev.orders.map((o) =>
          o.id === id
            ? { ...o, status, updatedAt: new Date().toISOString() }
            : o
        ),
      }));
    },
    []
  );

  // Orders don't have a notes field in the base type; we extend via a
  // type cast so consumers can optionally read it without breaking the
  // defined Order contract.
  const addOrderNote = useCallback((id: string, note: string) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => {
        if (o.id !== id) return o;
        const extended = o as Order & { notes?: string[] };
        return {
          ...o,
          updatedAt: new Date().toISOString(),
          notes: [...(extended.notes ?? []), note],
        } as Order;
      }),
    }));
  }, []);

  const getOrder = useCallback(
    (id: string): Order | undefined => {
      return orders.find((o) => o.id === id);
    },
    [orders]
  );

  return { orders, updateOrderStatus, addOrderNote, getOrder };
}
