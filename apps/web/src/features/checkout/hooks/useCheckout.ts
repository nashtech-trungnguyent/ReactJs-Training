import { useMutation } from "@tanstack/react-query";
import { checkoutApi } from "../api/checkoutApi";
import { CheckoutPayload, CheckoutResponse } from "../types";

export function useCheckout() {
  return useMutation<CheckoutResponse, Error, CheckoutPayload>({
    mutationFn: (payload) => checkoutApi.placeOrder(payload),
  });
}
