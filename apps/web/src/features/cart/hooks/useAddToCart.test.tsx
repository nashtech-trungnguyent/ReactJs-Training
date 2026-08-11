import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "react-toastify";
import { useAddToCart } from "./useAddToCart";
import { CART_QUERY_KEY } from "./useCart";

const mocks = vi.hoisted(() => ({
  addItemMock: vi.fn(),
  setPersistedCartMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
}));

vi.mock("../api/cartApi", () => ({
  cartApi: {
    addItem: mocks.addItemMock,
  },
}));

vi.mock("../cartStorage", () => ({
  setPersistedCart: mocks.setPersistedCartMock,
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: mocks.toastSuccessMock,
    error: mocks.toastErrorMock,
  },
}));

function createWrapperAndClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { queryClient, Wrapper };
}

describe("useAddToCart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds item and updates cache from existing cart", async () => {
    mocks.addItemMock.mockResolvedValueOnce(undefined);

    const { queryClient, Wrapper } = createWrapperAndClient();
    queryClient.setQueryData(CART_QUERY_KEY, {
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
    });

    const { result } = renderHook(() => useAddToCart(), { wrapper: Wrapper });

    await result.current.addToCart({
      productId: 1,
      slug: "asgaard-sofa",
      name: "Asgaard Sofa",
      image: "/images/product/product-01.png",
      price: 25000000,
      quantity: 2,
    });

    await waitFor(() => {
      expect(result.current.isAddingToCart).toBe(false);
    });

    const nextCart = queryClient.getQueryData(CART_QUERY_KEY) as {
      items: Array<{ quantity: number; subtotal: number }>;
    };

    expect(mocks.addItemMock).toHaveBeenCalledWith({
      productId: 1,
      quantity: 2,
    });
    expect(nextCart.items[0].quantity).toBe(3);
    expect(nextCart.items[0].subtotal).toBe(75000000);
    expect(mocks.setPersistedCartMock).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Item added to cart.");
  });

  it("creates new cart entry when cache is empty", async () => {
    mocks.addItemMock.mockResolvedValueOnce(undefined);

    const { queryClient, Wrapper } = createWrapperAndClient();

    const { result } = renderHook(() => useAddToCart(), { wrapper: Wrapper });

    await result.current.addToCart({
      productId: 8,
      slug: "asgaard-sofa-gallery",
      name: "Asgaard Sofa Gallery",
      image: "/images/product/product-08.png",
      price: 25200000,
      quantity: 1,
    });

    const nextCart = queryClient.getQueryData(CART_QUERY_KEY) as {
      items: Array<{ productId: number }>;
    };

    expect(nextCart.items).toHaveLength(1);
    expect(nextCart.items[0].productId).toBe(8);
    expect(mocks.setPersistedCartMock).toHaveBeenCalled();
  });

  it("shows error toast when add item fails", async () => {
    mocks.addItemMock.mockRejectedValueOnce(new Error("network error"));

    const { Wrapper } = createWrapperAndClient();
    const { result } = renderHook(() => useAddToCart(), { wrapper: Wrapper });

    await expect(
      result.current.addToCart({
        productId: 1,
        slug: "asgaard-sofa",
        name: "Asgaard Sofa",
        image: "/images/product/product-01.png",
        price: 25000000,
        quantity: 1,
      }),
    ).rejects.toThrow("network error");

    expect(toast.error).toHaveBeenCalledWith("Could not add item to cart.");
  });
});
