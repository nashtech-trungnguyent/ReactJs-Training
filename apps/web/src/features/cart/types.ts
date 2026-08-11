export type CartItemResponse = {
  id: string;
  productId: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type CartResponse = {
  items: CartItemResponse[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
};

export type AddCartItemPayload = {
  productId: number;
  quantity: number;
};

export type AddToCartLocalPayload = {
  productId: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type UpdateCartItemPayload = {
  itemId: string;
  quantity: number;
};

export type DeleteCartItemPayload = {
  itemId: string;
};
