import { useQueryClient } from "@tanstack/react-query";
import emailjs from "@emailjs/browser";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { createEmptyCart } from "../features/cart/cartUtils";
import { setPersistedCart } from "../features/cart/cartStorage";
import { CART_QUERY_KEY, useCart } from "../features/cart/hooks/useCart";
import { useCheckout } from "../features/checkout/hooks/useCheckout";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_ORDER_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID ??
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

function getOrderWebsiteLink(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return "";
}

type CheckoutFormValues = {
  firstName: string;
  lastName: string;
  companyName: string;
  country: string;
  streetAddress: string;
  city: string;
  province: string;
  zipCode: string;
  phone: string;
  email: string;
  additionalInfo: string;
  paymentMethod: "bank-transfer" | "cash-on-delivery";
};

function formatCurrency(value: number): string {
  return `Rs. ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
}

function formatCost(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function CheckoutPage() {
  const orderWebsiteLink = getOrderWebsiteLink();

  const queryClient = useQueryClient();
  const { data: cartData } = useCart();
  const { mutateAsync: placeOrder, isPending: isPlacingOrder } = useCheckout();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      country: "Sri Lanka",
      streetAddress: "",
      city: "",
      province: "Western Province",
      zipCode: "",
      phone: "",
      email: "",
      additionalInfo: "",
      paymentMethod: "bank-transfer",
    },
  });

  const cartItems = cartData?.items ?? [];
  const isCartEmpty = cartItems.length === 0;
  const subtotal = cartData?.subtotal ?? 0;
  const total = cartData?.total ?? subtotal;
  const canPlaceOrder = useMemo(
    () => !isCartEmpty && !isPlacingOrder,
    [isCartEmpty, isPlacingOrder],
  );

  const onSubmit = async (values: CheckoutFormValues) => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Add items before checkout.");
      return;
    }

    try {
      const response = await toast.promise(
        placeOrder({
          ...values,
          companyName: values.companyName || undefined,
          additionalInfo: values.additionalInfo || undefined,
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
        {
          pending: "Placing your order...",
          success: "Order placed successfully. Sending confirmation email...",
          error: "Could not place order. Please try again.",
        },
      );

      const emptyCart = createEmptyCart();
      queryClient.setQueryData(CART_QUERY_KEY, emptyCart);
      setPersistedCart(emptyCart);
      reset();
      toast.success(`Order confirmed: ${response.orderId}`);

      if (
        !EMAILJS_SERVICE_ID ||
        !EMAILJS_PUBLIC_KEY ||
        !EMAILJS_ORDER_TEMPLATE_ID
      ) {
        toast.error("Order placed but email service is not configured.");
        return;
      }

      try {
        await toast.promise(
          emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_ORDER_TEMPLATE_ID,
            {
              order_id: response.orderId,
              website_link: orderWebsiteLink,
              email: values.email,
              orders: cartItems.map((item) => ({
                name: item.name,
                units: item.quantity,
                price: formatCost(item.subtotal),
              })),
              cost: {
                shipping: formatCost(response.shipping),
                tax: formatCost(response.tax),
                total: formatCost(response.total),
              },
            },
            {
              publicKey: EMAILJS_PUBLIC_KEY,
            },
          ),
          {
            pending: "Sending order confirmation email...",
            success: "Order confirmation email sent.",
            error: "Order placed but failed to send confirmation email.",
          },
        );
      } catch {
        // toast.promise already surfaced the email failure
      }
    } catch {
      // toast.promise handles error feedback
    }
  };

  return (
    <>
      <section className="relative grid min-h-[240px] place-items-center overflow-hidden sm:min-h-[316px]">
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
          <h1 className="text-4xl font-medium sm:text-5xl">Checkout</h1>
          <p className="mt-3 font-medium">
            <Link to="/">Home</Link> <span className="mx-1">&gt;</span>
            <span className="font-light">Checkout</span>
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid w-[min(1240px,calc(100%-32px))] gap-12 lg:grid-cols-[1fr_0.86fr] lg:gap-20">
          <form
            id="checkout-form"
            className="grid gap-9"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2 className="mb-1 text-[30px] font-semibold sm:text-4xl">
              Billing details
            </h2>

            <div className="grid gap-8 sm:grid-cols-2">
              <label className="grid gap-5 font-medium">
                First Name
                <input
                  {...register("firstName", {
                    required: "First name is required.",
                  })}
                  className="h-[75px] rounded-[10px] border border-muted px-6"
                />
                {errors.firstName ? (
                  <span className="text-sm font-normal text-danger">
                    {errors.firstName.message}
                  </span>
                ) : null}
              </label>
              <label className="grid gap-5 font-medium">
                Last Name
                <input
                  {...register("lastName", {
                    required: "Last name is required.",
                  })}
                  className="h-[75px] rounded-[10px] border border-muted px-6"
                />
                {errors.lastName ? (
                  <span className="text-sm font-normal text-danger">
                    {errors.lastName.message}
                  </span>
                ) : null}
              </label>
            </div>

            <label className="grid gap-5 font-medium">
              Company Name (Optional)
              <input
                {...register("companyName")}
                className="h-[75px] rounded-[10px] border border-muted px-6"
              />
            </label>

            <label className="grid gap-5 font-medium">
              Country / Region
              <select
                {...register("country", { required: "Country is required." })}
                className="h-[75px] rounded-[10px] border border-muted px-6 text-muted"
              >
                <option>Sri Lanka</option>
                <option>Viet Nam</option>
                <option>United States</option>
              </select>
            </label>

            <label className="grid gap-5 font-medium">
              Street address
              <input
                {...register("streetAddress", {
                  required: "Street address is required.",
                })}
                className="h-[75px] rounded-[10px] border border-muted px-6"
              />
              {errors.streetAddress ? (
                <span className="text-sm font-normal text-danger">
                  {errors.streetAddress.message}
                </span>
              ) : null}
            </label>

            <label className="grid gap-5 font-medium">
              Town / City
              <input
                {...register("city", { required: "Town / City is required." })}
                className="h-[75px] rounded-[10px] border border-muted px-6"
              />
              {errors.city ? (
                <span className="text-sm font-normal text-danger">
                  {errors.city.message}
                </span>
              ) : null}
            </label>

            <label className="grid gap-5 font-medium">
              Province
              <select
                {...register("province", { required: "Province is required." })}
                className="h-[75px] rounded-[10px] border border-muted px-6 text-muted"
              >
                <option>Western Province</option>
                <option>Central Province</option>
                <option>Southern Province</option>
              </select>
            </label>

            <label className="grid gap-5 font-medium">
              ZIP code
              <input
                {...register("zipCode", { required: "ZIP code is required." })}
                className="h-[75px] rounded-[10px] border border-muted px-6"
              />
              {errors.zipCode ? (
                <span className="text-sm font-normal text-danger">
                  {errors.zipCode.message}
                </span>
              ) : null}
            </label>

            <label className="grid gap-5 font-medium">
              Phone
              <input
                {...register("phone", { required: "Phone is required." })}
                className="h-[75px] rounded-[10px] border border-muted px-6"
              />
              {errors.phone ? (
                <span className="text-sm font-normal text-danger">
                  {errors.phone.message}
                </span>
              ) : null}
            </label>

            <label className="grid gap-5 font-medium">
              Email address
              <input
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address.",
                  },
                })}
                className="h-[75px] rounded-[10px] border border-muted px-6"
                type="email"
              />
              {errors.email ? (
                <span className="text-sm font-normal text-danger">
                  {errors.email.message}
                </span>
              ) : null}
            </label>

            <textarea
              {...register("additionalInfo")}
              className="min-h-[75px] rounded-[10px] border border-muted px-6 py-6"
              placeholder="Additional information"
            ></textarea>
          </form>

          <aside className="self-start">
            <div className="border-b border-line pb-8">
              <div className="mb-4 flex justify-between text-2xl font-medium">
                <span>Product</span>
                <span>Subtotal</span>
              </div>

              <div className="mb-4 flex justify-between">
                <span className="text-muted">
                  {cartItems.length === 0 ? "No items" : ""}
                </span>
                <span></span>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="mb-4 flex justify-between">
                  <span className="text-muted">
                    {item.name}{" "}
                    <span className="font-medium text-black">
                      x {item.quantity}
                    </span>
                  </span>
                  <span>{formatCurrency(item.subtotal)}</span>
                </div>
              ))}

              <div className="mb-4 flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="text-2xl font-bold text-brand">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <div className="grid gap-4 py-8">
              {isCartEmpty ? (
                <p className="rounded-[10px] border border-danger bg-[#fff4f4] px-4 py-3 text-sm text-danger">
                  Your cart is empty. Checkout is not available until you add at
                  least one item.
                </p>
              ) : null}

              <label className="flex items-center gap-4 font-medium">
                <input
                  {...register("paymentMethod")}
                  value="bank-transfer"
                  type="radio"
                />
                Direct Bank Transfer
              </label>

              <p className="leading-relaxed text-muted">
                Make your payment directly into our bank account. Please use
                your Order ID as the payment reference. Your order will not be
                shipped until the funds have cleared in our account.
              </p>

              <label className="flex items-center gap-4 text-muted">
                <input
                  {...register("paymentMethod")}
                  value="cash-on-delivery"
                  type="radio"
                />
                Cash On Delivery
              </label>

              <p className="leading-relaxed">
                Your personal data will be used to support your experience
                throughout this website, to manage access to your account, and
                for other purposes described in our{" "}
                <strong>privacy policy</strong>.
              </p>

              <button
                className="mx-auto mt-4 inline-flex w-full justify-center rounded-[15px] border border-black px-8 py-4 text-lg hover:bg-black hover:text-white sm:w-auto sm:px-[102px] sm:text-xl"
                type="submit"
                form="checkout-form"
                disabled={!canPlaceOrder}
              >
                {isPlacingOrder ? "Placing..." : "Place order"}
              </button>
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
