import { CartResponse } from "./types";

const CART_STORAGE_KEY = "react-workshop-cart";

export function getPersistedCart(): CartResponse | null {
  if (typeof window === "undefined") {
    return null;
  }

  const serializedCart = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!serializedCart) {
    return null;
  }

  try {
    return JSON.parse(serializedCart) as CartResponse;
  } catch {
    return null;
  }
}

export function setPersistedCart(cart: CartResponse): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}
