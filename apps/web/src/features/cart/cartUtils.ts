import { AddToCartLocalPayload, CartItemResponse, CartResponse } from "./types";

export function createEmptyCart(): CartResponse {
  return {
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
  };
}

export function calculateCartTotals(
  items: CartItemResponse[],
  currentCart?: CartResponse | null,
): Pick<CartResponse, "subtotal" | "shipping" | "tax" | "discount" | "total"> {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const shipping = currentCart?.shipping ?? 0;
  const tax = currentCart?.tax ?? 0;
  const discount = currentCart?.discount ?? 0;

  return {
    subtotal,
    shipping,
    tax,
    discount,
    total: subtotal + shipping + tax - discount,
  };
}

export function updateItemQuantity(
  cart: CartResponse,
  itemId: string,
  quantity: number,
): CartResponse {
  const nextItems = cart.items.map((item) => {
    if (item.id !== itemId) {
      return item;
    }

    return {
      ...item,
      quantity,
      subtotal: item.price * quantity,
    };
  });

  return {
    ...cart,
    items: nextItems,
    ...calculateCartTotals(nextItems, cart),
  };
}

export function removeItemFromCart(
  cart: CartResponse,
  itemId: string,
): CartResponse {
  const nextItems = cart.items.filter((item) => item.id !== itemId);

  return {
    ...cart,
    items: nextItems,
    ...calculateCartTotals(nextItems, cart),
  };
}

export function addItemToCart(
  cart: CartResponse,
  payload: AddToCartLocalPayload,
): CartResponse {
  const existingItem = cart.items.find(
    (item) => item.productId === payload.productId,
  );
  if (existingItem) {
    return updateItemQuantity(
      cart,
      existingItem.id,
      existingItem.quantity + payload.quantity,
    );
  }

  const nextItems = [
    ...cart.items,
    {
      id: `cart-local-${payload.productId}`,
      productId: payload.productId,
      slug: payload.slug,
      name: payload.name,
      image: payload.image,
      price: payload.price,
      quantity: payload.quantity,
      subtotal: payload.price * payload.quantity,
    },
  ];

  return {
    ...cart,
    items: nextItems,
    ...calculateCartTotals(nextItems, cart),
  };
}
