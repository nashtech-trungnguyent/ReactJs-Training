import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useAddToCart } from "../features/cart/hooks/useAddToCart";
import { useProducts } from "../features/products/hooks/useProduct";
import { formatNumber } from "../utils/formatNumber";

const PAGE_SIZE_OPTIONS = [8, 16, 24];

export default function ShopPage() {
  const loadingToastId = "shop-products-loading";
  const errorToastId = "shop-products-error";
  const { data, isLoading, isError } = useProducts();
  const { addToCart, isAddingToCart } = useAddToCart();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalItems = Math.max(total, items.length);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading products...", { toastId: loadingToastId });
      return;
    }

    toast.dismiss(loadingToastId);
  }, [isLoading]);

  useEffect(() => {
    if (!isError) {
      return;
    }

    toast.error("Cannot load products right now.", { toastId: errorToastId });
  }, [isError]);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const showingFrom = items.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(showingFrom + pagedItems.length - 1, totalItems);

  const pageButtons = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      <section className="relative grid min-h-[316px] place-items-center overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/common/common-10.jpg"
          alt=""
        />
        <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]"></div>
        <div className="relative text-center">
          <img
            className="mx-auto mb-1 h-12 w-12 object-contain"
            src="/images/common/common-01.png"
            alt=""
          />
          <h1 className="text-5xl font-medium">Shop</h1>
          <p className="mt-3 font-medium">
            <Link to="/">Home</Link> <span className="mx-1">&gt;</span>
            <span className="font-light">Shop</span>
          </p>
        </div>
      </section>
      <section className="bg-beige py-8">
        <div className="mx-auto flex w-[min(1240px,calc(100%-32px))] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-3 text-xl">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              >
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              Filter
            </span>
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
            </svg>
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            >
              <path d="M8 6h12M8 12h12M8 18h12" />
              <path d="M4 6h.01M4 12h.01M4 18h.01" />
            </svg>
            <span className="h-9 w-px bg-[#9f9f9f]"></span>
            <span>
              Showing {showingFrom}-{showingTo} of {totalItems} results
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-7">
            <label className="flex items-center gap-4">
              Show
              <select
                className="h-[55px] w-[55px] bg-white text-center text-xl text-muted"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-4">
              Short by
              <select className="h-[55px] w-[188px] bg-white px-7 text-xl text-muted">
                <option>Default</option>
              </select>
            </label>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto w-[min(1236px,calc(100%-32px))]">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {pagedItems.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                description={p.shortDescription}
                image={p.thumbnail}
                price={`Rp ${formatNumber(p.price)}`}
                originalPrice={
                  p.originalPrice
                    ? `Rp ${formatNumber(p.originalPrice)}`
                    : undefined
                }
                badgeText={
                  p.badgeType === "fresh"
                    ? p.badge
                    : `-${p.discountPercentage}%`
                }
                badgeType={p.badgeType}
                productLink={`/products/${p.slug}`}
                onAddToCart={() =>
                  addToCart({
                    productId: p.id,
                    slug: p.slug,
                    name: p.name,
                    image: p.thumbnail,
                    price: p.price,
                    quantity: 1,
                  })
                }
                isAddingToCart={isAddingToCart}
              />
            ))}
          </div>
        </div>
        <div className="mt-16 flex justify-center gap-9">
          {pageButtons.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
              className={`grid h-[60px] min-w-[60px] place-items-center rounded-[10px] text-xl ${
                page === pageNumber
                  ? "bg-brand px-6 text-white"
                  : "bg-beige px-6"
              }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(current + 1, totalPages))
            }
            className="grid h-[60px] min-w-[60px] place-items-center rounded-[10px] bg-beige px-7 text-xl"
            disabled={page >= totalPages}
          >
            Next
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            className="grid h-[60px] min-w-[60px] place-items-center rounded-[10px] bg-beige px-7 text-xl"
            disabled={page <= 1}
          >
            Prev
          </button>
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
