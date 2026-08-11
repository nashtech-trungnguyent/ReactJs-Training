import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkoutApi } from "./checkoutApi";
import { api } from "../../../api";

const mockedFns = vi.hoisted(() => ({
  postMock: vi.fn(),
}));

vi.mock("../../../api", () => ({
  api: {
    post: mockedFns.postMock,
  },
}));

const apiMock = vi.mocked(api);

describe("checkoutApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("posts checkout payload", async () => {
    const payload = {
      firstName: "John",
      lastName: "Doe",
      country: "Viet Nam",
      streetAddress: "123 Main",
      city: "HCM",
      province: "HCM",
      zipCode: "700000",
      phone: "0123456789",
      email: "john@example.com",
      paymentMethod: "bank-transfer" as const,
      items: [{ productId: 1, quantity: 1 }],
    };

    apiMock.post.mockResolvedValueOnce({
      success: true,
      orderId: "ORD-1",
      status: "confirmed",
      subtotal: 1,
      shipping: 0,
      tax: 0,
      discount: 0,
      total: 1,
    });

    await checkoutApi.placeOrder(payload);

    expect(apiMock.post).toHaveBeenCalledWith(
      "/c/2bf1-c646-4b04-b713",
      payload,
    );
  });
});
