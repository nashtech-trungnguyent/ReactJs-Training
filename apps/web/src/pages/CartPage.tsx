import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { cartApi } from "../features/cart/api/cartApi";
import { setPersistedCart } from "../features/cart/cartStorage";
import {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
} from "../features/cart/cartUtils";
import { useAddToCart } from "../features/cart/hooks/useAddToCart";
import { useCart } from "../features/cart/hooks/useCart";
import { CART_QUERY_KEY } from "../features/cart/hooks/useCart";
import { CartItemResponse, CartResponse } from "../features/cart/types";
import { useProducts } from "../features/products/hooks/useProduct";

function formatCurrency(value: number): string {
  return `Rs. ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
}

export default function CartPage() {
  const queryClient = useQueryClient();
  const { data: cartData, isLoading, isError } = useCart();
  const { addToCart, isAddingToCart } = useAddToCart();
  const { data: productsData } = useProducts();
  const [addProductId, setAddProductId] = useState<number | null>(null);
  const [addQuantity, setAddQuantity] = useState(1);
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading cart...", { toastId: "cart-loading" });
      return;
    }

    toast.dismiss("cart-loading");
  }, [isLoading]);

  useEffect(() => {
    if (isError) {
      toast.error("Cannot load cart data.", { toastId: "cart-error" });
    }
  }, [isError]);

  useEffect(() => {
    const defaultProductId = productsData?.items?.[0]?.id;
    if (defaultProductId && !addProductId) {
      setAddProductId(defaultProductId);
    }
  }, [productsData, addProductId]);

  const products = productsData?.items ?? [];
  const cartItems = cartData?.items ?? [];
  const hasCartItems = cartItems.length > 0;
  const subtotal = cartData?.subtotal ?? 0;
  const total = cartData?.total ?? subtotal;

  const canSubmitAdd = useMemo(() => {
    return Boolean(addProductId) && addQuantity > 0 && !isAddingToCart;
  }, [addProductId, addQuantity, isAddingToCart]);

  const handleAddItem = async () => {
    if (!addProductId || addQuantity <= 0) {
      return;
    }

    const selectedProduct = products.find(
      (product) => product.id === addProductId,
    );
    if (!selectedProduct) {
      toast.error("Cannot add item. Product not found.");
      return;
    }

    try {
      await addToCart({
        productId: addProductId,
        slug: selectedProduct.slug,
        name: selectedProduct.name,
        image: selectedProduct.thumbnail,
        price: selectedProduct.price,
        quantity: addQuantity,
      });
      setAddQuantity(1);
    } catch {}
  };

  const handleUpdateQuantity = async (
    item: CartItemResponse,
    quantity: number,
  ) => {
    const normalizedQuantity = Math.max(1, quantity);
    setPendingItemId(item.id);

    try {
      await cartApi.updateItem({
        itemId: item.id,
        quantity: normalizedQuantity,
      });

      queryClient.setQueryData<CartResponse>(CART_QUERY_KEY, (currentCart) => {
        if (!currentCart) {
          return currentCart;
        }

        const nextCart = updateItemQuantity(
          currentCart,
          item.id,
          normalizedQuantity,
        );
        setPersistedCart(nextCart);
        return nextCart;
      });
    } catch {
      toast.error("Could not update cart item.");
    } finally {
      setPendingItemId(null);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    setPendingItemId(itemId);

    try {
      await cartApi.deleteItem({ itemId });

      queryClient.setQueryData<CartResponse>(CART_QUERY_KEY, (currentCart) => {
        if (!currentCart) {
          return currentCart;
        }

        const nextCart = removeItemFromCart(currentCart, itemId);
        setPersistedCart(nextCart);
        return nextCart;
      });

      toast.success("Item removed from cart.");
    } catch {
      toast.error("Could not remove cart item.");
    } finally {
      setPendingItemId(null);
    }
  };

  return (
    <>
      <section className="relative grid min-h-[316px] place-items-center overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/common/common-06.png"
          alt=""
        />
        <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]"></div>
        <div className="relative text-center">
          <img
            className="mx-auto mb-1 h-12 w-12 object-contain"
            src="/images/common/common-01.png"
            alt=""
          />
          <h1 className="text-5xl font-medium">Cart</h1>
          <p className="mt-3 font-medium">
            <Link to="/">Home</Link> <span className="mx-1">&gt;</span>
            <span className="font-light">Cart</span>
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid w-[min(1240px,calc(100%-32px))] gap-8 lg:grid-cols-[1fr_393px]">
          <div className="overflow-x-auto">
            <div className="mb-6 grid gap-4 rounded-[10px] border border-line p-4 md:grid-cols-[1fr_120px_auto]">
              <select
                className="h-12 rounded-[10px] border border-muted px-4"
                value={addProductId ?? ""}
                onChange={(event) =>
                  setAddProductId(Number(event.target.value))
                }
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>

              <input
                className="h-12 rounded-[10px] border border-muted px-4"
                min={1}
                type="number"
                value={addQuantity}
                onChange={(event) =>
                  setAddQuantity(Math.max(1, Number(event.target.value) || 1))
                }
              />

              <button
                type="button"
                className="h-12 rounded-[10px] bg-brand px-6 font-medium text-white hover:bg-[#9d7626] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleAddItem}
                disabled={!canSubmitAdd}
              >
                {isAddingToCart ? "Adding..." : "Add Item"}
              </button>
            </div>

            <table className="w-full min-w-[760px]">
              <thead className="bg-beige">
                <tr>
                  <th className="px-6 py-4 text-left">Product</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Quantity</th>
                  <th className="px-6 py-4 text-left">Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.length === 0 ? (
                  <tr>
                    <td className="px-6 py-14 text-muted" colSpan={5}>
                      Your cart is empty.
                    </td>
                  </tr>
                ) : null}

                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-14">
                      <div className="flex items-center gap-8">
                        <img
                          className="h-[105px] w-[105px] rounded-[10px] bg-beige object-cover"
                          src={item.image}
                          alt={item.name}
                        />
                        <span className="text-muted">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-14 text-muted">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-6 py-14">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="h-8 w-8 rounded border border-muted"
                          onClick={() =>
                            handleUpdateQuantity(item, item.quantity - 1)
                          }
                          disabled={
                            pendingItemId === item.id || item.quantity <= 1
                          }
                        >
                          -
                        </button>
                        <input
                          className="h-8 w-12 rounded border border-muted text-center"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          type="button"
                          className="h-8 w-8 rounded border border-muted"
                          onClick={() =>
                            handleUpdateQuantity(item, item.quantity + 1)
                          }
                          disabled={pendingItemId === item.id}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-14">
                      {formatCurrency(item.subtotal)}
                    </td>
                    <td className="px-6 py-14">
                      <button
                        type="button"
                        className="text-brand"
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={pendingItemId === item.id}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <aside className="bg-beige px-12 py-8">
            <h2 className="mb-14 text-center text-[32px] font-semibold">
              Cart Totals
            </h2>
            <div className="grid gap-8">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="text-muted">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="text-xl font-medium text-brand">
                  {formatCurrency(total)}
                </span>
              </div>
              <Link
                className={`mx-auto mt-4 inline-flex rounded-[15px] border px-14 py-3 text-xl ${
                  hasCartItems
                    ? "border-black hover:bg-black hover:text-white"
                    : "cursor-not-allowed border-muted text-muted"
                }`}
                to="/checkout"
                aria-disabled={!hasCartItems}
                onClick={(event) => {
                  if (hasCartItems) {
                    return;
                  }

                  event.preventDefault();
                  toast.error("Your cart is empty. Add items before checkout.");
                }}
              >
                Check Out
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-[#faf3ea] py-[38px]">
        <div className="mx-auto grid w-[min(1334px,calc(100%-32px))] gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 text-[#242424]">
            <svg
              className="h-12 w-12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
              <path d="M6 5H4v2a4 4 0 0 0 4 4M18 5h2v2a4 4 0 0 1-4 4M12 13v4M9 21h6M8 17h8" />
            </svg>
            <div>
              <h3 className="text-[25px] font-semibold leading-tight">
                High Quality
              </h3>
              <p className="text-xl font-medium text-[#898989]">
                crafted from top materials
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#242424]">
            <svg
              className="h-12 w-12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 7 10 17l-5-5" />
              <path d="M21 12a9 9 0 1 1-3-6.7" />
            </svg>
            <div>
              <h3 className="text-[25px] font-semibold leading-tight">
                Warranty Protection
              </h3>
              <p className="text-xl font-medium text-[#898989]">Over 2 years</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#242424]">
            <svg
              className="h-12 w-12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" />
              <circle cx="7" cy="19" r="2" />
              <circle cx="17" cy="19" r="2" />
            </svg>
            <div>
              <h3 className="text-[25px] font-semibold leading-tight">
                Free Shipping
              </h3>
              <p className="text-xl font-medium text-[#898989]">
                Order over 150 $
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#242424]">
            <svg
              className="h-12 w-12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12a8 8 0 0 1 16 0v4a2 2 0 0 1-2 2h-2" />
              <path d="M6 12v4H4v-4h2ZM20 12v4h-2v-4h2ZM15 19a3 3 0 0 1-6 0" />
            </svg>
            <div>
              <h3 className="text-[25px] font-semibold leading-tight">
                24 / 7 Support
              </h3>
              <p className="text-xl font-medium text-[#898989]">
                Dedicated support
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
