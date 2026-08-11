import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCart } from "./useCart";

const mocks = vi.hoisted(() => ({
  getCartMock: vi.fn(),
  getPersistedCartMock: vi.fn(),
  setPersistedCartMock: vi.fn(),
}));

vi.mock("../api/cartApi", () => ({
  cartApi: {
    getCart: mocks.getCartMock,
  },
}));

vi.mock("../cartStorage", () => ({
  getPersistedCart: mocks.getPersistedCartMock,
  setPersistedCart: mocks.setPersistedCartMock,
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useCart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns persisted cart when localStorage has data", async () => {
    const persistedCart = {
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

    mocks.getPersistedCartMock.mockReturnValueOnce(persistedCart);

    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(persistedCart);
    expect(mocks.getCartMock).not.toHaveBeenCalled();
    expect(mocks.setPersistedCartMock).not.toHaveBeenCalled();
  });

  it("fetches from API and persists cart when localStorage is empty", async () => {
    const apiCart = {
      items: [],
      subtotal: 0,
      shipping: 0,
      tax: 0,
      discount: 0,
      total: 0,
    };

    mocks.getPersistedCartMock.mockReturnValueOnce(null);
    mocks.getCartMock.mockResolvedValueOnce(apiCart);

    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(apiCart);
    expect(mocks.getCartMock).toHaveBeenCalledTimes(1);
    expect(mocks.setPersistedCartMock).toHaveBeenCalledWith(apiCart);
  });
});
