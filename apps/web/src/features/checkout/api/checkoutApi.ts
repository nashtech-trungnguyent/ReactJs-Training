import { api } from "../../../api";
import { CheckoutPayload, CheckoutResponse } from "../types";

const CHECKOUT_ENDPOINT = "/c/2bf1-c646-4b04-b713";

export const checkoutApi = {
  async placeOrder(payload: CheckoutPayload): Promise<CheckoutResponse> {
    return api.post<CheckoutResponse, CheckoutPayload>(
      CHECKOUT_ENDPOINT,
      payload,
    );
  },
};
