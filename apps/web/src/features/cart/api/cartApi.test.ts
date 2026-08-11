import { beforeEach, describe, expect, it, vi } from "vitest";
import { cartApi } from "./cartApi";
import { api } from "../../../api";

const mockedFns = vi.hoisted(() => ({
  getMock: vi.fn(),
  postMock: vi.fn(),
  patchMock: vi.fn(),
  deleteMock: vi.fn(),
}));

vi.mock("../../../api", () => ({
  api: {
    get: mockedFns.getMock,
    post: mockedFns.postMock,
    patch: mockedFns.patchMock,
    delete: mockedFns.deleteMock,
  },
}));

const apiMock = vi.mocked(api);

describe("cartApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("gets cart", async () => {
    apiMock.get.mockResolvedValueOnce({
      items: [],
      subtotal: 0,
      shipping: 0,
      tax: 0,
      discount: 0,
      total: 0,
    });

    await cartApi.getCart();

    expect(apiMock.get).toHaveBeenCalledWith("/c/4758-8939-498e-a12c");
  });

  it("adds item", async () => {
    apiMock.post.mockResolvedValueOnce(undefined);

    await cartApi.addItem({ productId: 1, quantity: 2 });

    expect(apiMock.post).toHaveBeenCalledWith("/c/0bd3-1de3-4e85-92fb", {
      productId: 1,
      quantity: 2,
    });
  });

  it("updates item", async () => {
    apiMock.patch.mockResolvedValueOnce(undefined);

    await cartApi.updateItem({ itemId: "cart-1", quantity: 3 });

    expect(apiMock.patch).toHaveBeenCalledWith("/c/05e7-d03f-434a-960f", {
      itemId: "cart-1",
      quantity: 3,
    });
  });

  it("deletes item", async () => {
    apiMock.delete.mockResolvedValueOnce(undefined);

    await cartApi.deleteItem({ itemId: "cart-1" });

    expect(apiMock.delete).toHaveBeenCalledWith("/c/dc1d-e752-4dc6-b4f7", {
      data: { itemId: "cart-1" },
    });
  });
});
