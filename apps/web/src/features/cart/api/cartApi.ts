import { api } from "../../../api";
import {
  AddCartItemPayload,
  CartResponse,
  DeleteCartItemPayload,
  UpdateCartItemPayload,
} from "../types";

const CART_ENDPOINTS = {
  GET: "/c/4758-8939-498e-a12c",
  ADD: "/c/0bd3-1de3-4e85-92fb",
  UPDATE: "/c/05e7-d03f-434a-960f",
  DELETE: "/c/dc1d-e752-4dc6-b4f7",
} as const;

export const cartApi = {
  async getCart(): Promise<CartResponse> {
    return api.get<CartResponse>(CART_ENDPOINTS.GET);
  },

  async addItem(payload: AddCartItemPayload): Promise<void> {
    await api.post<unknown, AddCartItemPayload>(CART_ENDPOINTS.ADD, payload);
  },

  async updateItem(payload: UpdateCartItemPayload): Promise<void> {
    await api.patch<unknown, UpdateCartItemPayload>(
      CART_ENDPOINTS.UPDATE,
      payload,
    );
  },

  async deleteItem(payload: DeleteCartItemPayload): Promise<void> {
    await api.delete<unknown>(CART_ENDPOINTS.DELETE, {
      data: payload,
    });
  },
};
