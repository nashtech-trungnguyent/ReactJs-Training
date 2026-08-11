import { describe, expect, it } from "vitest";
import {
  addItemToCart,
  calculateCartTotals,
  createEmptyCart,
  removeItemFromCart,
  updateItemQuantity,
} from "./cartUtils";
import { CartResponse } from "./types";

function createCartFixture(): CartResponse {
  return {
    items: [
      {
        id: "cart-1",
        productId: 1,
        slug: "asgaard-sofa",
        name: "Asgaard Sofa",
        image: "/images/product/product-01.png",
        price: 25000000,
        quantity: 1,
        subtotal: 25000000,
      },
      {
        id: "cart-2",
        productId: 7,
        slug: "stuart-sofa",
        name: "Stuart Sofa",
        image: "/images/product/product-07.png",
        price: 21400000,
        quantity: 1,
        subtotal: 21400000,
      },
    ],
    subtotal: 46400000,
    shipping: 1000,
    tax: 2000,
    discount: 500,
    total: 46402500,
  };
}

describe("cartUtils", () => {
  it("creates an empty cart", () => {
    expect(createEmptyCart()).toEqual({
      items: [],
      subtotal: 0,
      shipping: 0,
      tax: 0,
      discount: 0,
      total: 0,
    });
  });

  it("calculates totals with defaults", () => {
    const totals = calculateCartTotals([
      {
        id: "1",
        productId: 1,
        slug: "p",
        name: "P",
        image: "i",
        price: 10,
        quantity: 2,
        subtotal: 20,
      },
    ]);

    expect(totals).toEqual({
      subtotal: 20,
      shipping: 0,
      tax: 0,
      discount: 0,
      total: 20,
    });
  });

  it("updates quantity and subtotal for one item", () => {
    const cart = createCartFixture();
    const updated = updateItemQuantity(cart, "cart-1", 3);
    const firstItem = updated.items[0];
    const secondItem = updated.items[1];

    expect(firstItem).toBeDefined();
    expect(secondItem).toBeDefined();
    expect(firstItem?.quantity).toBe(3);
    expect(firstItem?.subtotal).toBe(75000000);
    expect(secondItem).toEqual(cart.items[1]);
    expect(updated.subtotal).toBe(96400000);
  });

  it("removes item and recalculates totals", () => {
    const cart = createCartFixture();
    const updated = removeItemFromCart(cart, "cart-1");
    const firstItem = updated.items[0];

    expect(updated.items).toHaveLength(1);
    expect(firstItem).toBeDefined();
    expect(firstItem?.id).toBe("cart-2");
    expect(updated.subtotal).toBe(21400000);
  });

  it("adds new item to cart", () => {
    const cart = createCartFixture();
    const updated = addItemToCart(cart, {
      productId: 8,
      slug: "asgaard-sofa-gallery",
      name: "Asgaard Sofa Gallery",
      image: "/images/product/product-08.png",
      price: 25200000,
      quantity: 1,
    });
    const addedItem = updated.items[2];

    expect(updated.items).toHaveLength(3);
    expect(addedItem).toBeDefined();
    expect(addedItem?.id).toBe("cart-local-8");
    expect(updated.subtotal).toBe(71600000);
  });

  it("increases quantity when adding existing item", () => {
    const cart = createCartFixture();
    const updated = addItemToCart(cart, {
      productId: 1,
      slug: "asgaard-sofa",
      name: "Asgaard Sofa",
      image: "/images/product/product-01.png",
      price: 25000000,
      quantity: 2,
    });
    const firstItem = updated.items[0];

    expect(updated.items).toHaveLength(2);
    expect(firstItem).toBeDefined();
    expect(firstItem?.quantity).toBe(3);
    expect(firstItem?.subtotal).toBe(75000000);
  });
});
