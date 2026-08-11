import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { cartApi } from "../api/cartApi";
import { setPersistedCart } from "../cartStorage";
import { addItemToCart, createEmptyCart } from "../cartUtils";
import { AddToCartLocalPayload, CartResponse } from "../types";
import { CART_QUERY_KEY } from "./useCart";

export function useAddToCart() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: AddToCartLocalPayload) => {
      await cartApi.addItem({
        productId: payload.productId,
        quantity: payload.quantity,
      });

      return payload;
    },
    onSuccess: (payload) => {
      queryClient.setQueryData<CartResponse>(CART_QUERY_KEY, (currentCart) => {
        const baseCart = currentCart ?? createEmptyCart();
        const nextCart = addItemToCart(baseCart, payload);
        setPersistedCart(nextCart);
        return nextCart;
      });
      toast.success("Item added to cart.");
    },
    onError: () => {
      toast.error("Could not add item to cart.");
    },
  });

  return {
    addToCart: mutation.mutateAsync,
    isAddingToCart: mutation.isPending,
  };
}
