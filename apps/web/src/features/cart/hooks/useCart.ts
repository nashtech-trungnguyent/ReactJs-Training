import { useQuery } from "@tanstack/react-query";
import { cartApi } from "../api/cartApi";
import { getPersistedCart, setPersistedCart } from "../cartStorage";
import { CartResponse } from "../types";

export const CART_QUERY_KEY = ["cart"] as const;

export function useCart() {
  return useQuery<CartResponse>({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const persistedCart = getPersistedCart();
      if (persistedCart) {
        return persistedCart;
      }

      const apiCart = await cartApi.getCart();
      setPersistedCart(apiCart);
      return apiCart;
    },
  });
}
