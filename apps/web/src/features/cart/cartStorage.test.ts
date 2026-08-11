import { afterEach, describe, expect, it } from "vitest";
import { getPersistedCart, setPersistedCart } from "./cartStorage";
import { CartResponse } from "./types";

const cartFixture: CartResponse = {
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
  ],
  subtotal: 25000000,
  shipping: 0,
  tax: 0,
  discount: 0,
  total: 25000000,
};

afterEach(() => {
  window.localStorage.clear();
});

describe("cartStorage", () => {
  it("returns null when storage has no cart", () => {
    expect(getPersistedCart()).toBeNull();
  });

  it("stores and reads cart from localStorage", () => {
    setPersistedCart(cartFixture);

    expect(getPersistedCart()).toEqual(cartFixture);
  });

  it("returns null on invalid json", () => {
    window.localStorage.setItem("react-workshop-cart", "{not-json");

    expect(getPersistedCart()).toBeNull();
  });
});
