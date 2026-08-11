import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useAddToCart } from "../features/cart/hooks/useAddToCart";
import { useProductDetail } from "../features/products/hooks/useProductDetail";
import { formatNumber } from "../utils/formatNumber";

const defaultTabs = [
  {
    key: "description",
    label: "Description",
    active: true,
    content: [
      "Embodying the raw, wayward spirit of rock and roll, the Kilburn portable active stereo speaker takes the unmistakable look and sound of Marshall and unplugs the chords.",
      "Weighing in under 7 pounds, the Kilburn is a lightweight piece of vintage styled engineering. The analogue knobs allow you to fine tune the controls to your personal preferences while the guitar-influenced leather strap enables easy travel.",
    ],
  },
  {
    key: "additional-information",
    label: "Additional Information",
    content: [
      "Frame: kiln-dried solid wood",
      "Upholstery: textured premium fabric",
      "Seat depth: lounge comfort profile",
    ],
  },
  {
    key: "reviews",
    label: "Reviews [5]",
    content: [
      "Customers highlight comfort, fabric texture, and the balanced scale for medium-sized living rooms.",
    ],
  },
];

function getRelatedBadgeType(badge?: string): "" | "danger" | "fresh" {
  if (!badge) {
    return "";
  }

  const normalizedBadge = badge.toLowerCase();
  if (normalizedBadge === "new") {
    return "fresh";
  }

  if (normalizedBadge === "sale") {
    return "danger";
  }

  return "";
}

function parsePriceTextToNumber(priceText?: string): number {
  if (!priceText) {
    return 0;
  }

  const numeric = Number(priceText.replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function clampQuantity(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function ProductDetailPage() {
  const { productKey } = useParams();
  const { addToCart, isAddingToCart } = useAddToCart();
  const loadingToastId = `product-detail-loading-${productKey ?? "default"}`;
  const errorToastId = `product-detail-error-${productKey ?? "default"}`;
  const { data: detail, isLoading, isError } = useProductDetail(productKey);

  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading product details...", { toastId: loadingToastId });
      return;
    }

    toast.dismiss(loadingToastId);
  }, [isLoading, loadingToastId]);

  useEffect(() => {
    if (!isError) {
      return;
    }

    toast.error("Cannot load product detail right now.", {
      toastId: errorToastId,
    });
  }, [isError, errorToastId]);

  const currentProductLabel =
    detail?.name ??
    (productKey ? `Asgaard sofa #${productKey}` : "Asgaard sofa");
  const rawBreadcrumbs = detail?.breadcrumb?.length
    ? detail.breadcrumb
    : [
        { label: "Home", href: "/" },
        { label: "Shop", href: "/shop" },
      ];
  const breadcrumbs =
    rawBreadcrumbs.at(-1)?.label.trim().toLowerCase() ===
    currentProductLabel.trim().toLowerCase()
      ? rawBreadcrumbs.slice(0, -1)
      : rawBreadcrumbs;
  const title = detail?.name ?? "Asgaard sofa";
  const mainPrice =
    detail?.priceText ?? `Rp ${formatNumber(detail?.price ?? 25000000)}`;
  const rating = detail?.rating ?? 5;
  const reviewLabel = detail?.reviewLabel ?? "5 Customer Review";
  const shortDescription =
    detail?.shortDescription ??
    "Setting the bar as one of the most comfortable pieces in its class, this compact sofa has a balanced profile and a warm living-room presence.";

  const galleryThumbnails =
    detail?.gallery?.thumbnails && detail.gallery.thumbnails.length > 0
      ? detail.gallery.thumbnails
      : [
          "/images/product/product-01.png",
          "/images/product/product-02.png",
          "/images/product/product-03.jpg",
          "/images/product/product-04.png",
        ];
  const galleryActive =
    detail?.gallery?.active ?? "/images/product/product-01.png";
  const metaSku = detail?.meta?.sku ?? "SS001";
  const metaCategory = detail?.meta?.category ?? "Sofas";
  const metaTags = detail?.meta?.tags?.length
    ? detail.meta.tags.join(", ")
    : "Sofa, Chair, Home, Shop";
  const sizes = detail?.sizes?.length
    ? detail.sizes
    : [
        { label: "L", value: "l", selected: true },
        { label: "XL", value: "xl" },
        { label: "XS", value: "xs" },
      ];
  const colors = detail?.colors?.length
    ? detail.colors
    : [
        { name: "Purple", value: "#816DFA" },
        { name: "Black", value: "#000000", selected: true },
        { name: "Gold", value: "#B88E2F" },
      ];
  const minQuantity = detail?.quantity?.min ?? 1;
  const maxQuantity = detail?.quantity?.max ?? 99;
  const defaultQuantity = detail?.quantity?.default ?? 1;
  const [quantity, setQuantity] = useState(
    clampQuantity(defaultQuantity, minQuantity, maxQuantity),
  );
  const primaryActionLabel = detail?.actions?.primary.label ?? "Add To Cart";
  const compareActionLabel =
    detail?.actions?.secondary?.[0]?.label ?? "Compare";
  const shareText = detail?.share?.length
    ? detail.share.map((item) => item.label).join(" ")
    : "Facebook LinkedIn Twitter";
  const tabs = detail?.tabs?.length ? detail.tabs : defaultTabs;
  const defaultActiveTabKey = (tabs.find((tab) => tab.active) ?? tabs[0])?.key;
  const [selectedTabKey, setSelectedTabKey] = useState(defaultActiveTabKey);

  useEffect(() => {
    setSelectedTabKey(defaultActiveTabKey);
  }, [defaultActiveTabKey, detail?.id]);

  useEffect(() => {
    setQuantity(clampQuantity(defaultQuantity, minQuantity, maxQuantity));
  }, [defaultQuantity, minQuantity, maxQuantity, detail?.id]);

  const activeTab =
    tabs.find((tab) => tab.key === selectedTabKey) ??
    tabs.find((tab) => tab.active) ??
    tabs[0];

  const relatedProductsFromApi = detail?.relatedProducts?.map((product) => ({
    id: product.id,
    name: product.name,
    description: detail.category,
    image: product.thumbnail,
    price: product.priceText,
    originalPrice: product.originalPriceText,
    badgeText: product.badge ?? "",
    slug: product.slug,
    badgeType: getRelatedBadgeType(product.badge),
  }));

  const relatedProductsToRender =
    relatedProductsFromApi && relatedProductsFromApi.length > 0
      ? relatedProductsFromApi
      : [];

  return (
    <>
      <section className="bg-beige py-6 sm:py-8">
        <div className="mx-auto flex w-[min(1240px,calc(100%-32px))] flex-wrap items-center gap-3 text-sm text-muted sm:gap-6 sm:text-base">
          {breadcrumbs.map((item, index) => (
            <div key={`${item.label}-${index}`} className="contents">
              {item.href ? (
                <Link to={item.href}>{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
              {index < breadcrumbs.length - 1 ? <span>&gt;</span> : null}
            </div>
          ))}
          <span className="hidden h-9 w-px bg-muted sm:block"></span>
          <span className="text-black">{currentProductLabel}</span>
        </div>
      </section>

      {isLoading ? (
        <p className="mx-auto w-[min(1240px,calc(100%-32px))] py-4 text-muted">
          Loading product detail...
        </p>
      ) : null}
      {isError ? (
        <p className="mx-auto w-[min(1240px,calc(100%-32px))] py-4 text-muted">
          Cannot load product detail. Showing fallback data.
        </p>
      ) : null}

      <section className="py-9">
        <div className="mx-auto grid w-[min(1240px,calc(100%-32px))] gap-10 lg:grid-cols-[553px_1fr] lg:gap-20">
          <div className="grid gap-6 sm:grid-cols-[76px_1fr] sm:gap-8">
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-1 sm:gap-8">
              {galleryThumbnails.map((thumbnail) => (
                <img
                  key={thumbnail}
                  className="h-20 w-20 rounded-[10px] bg-beige object-cover"
                  src={thumbnail}
                  alt=""
                />
              ))}
            </div>
            <div className="grid min-h-[320px] place-items-center rounded-[10px] bg-beige p-5 sm:min-h-[500px] sm:p-8">
              <img
                className="max-h-[430px] w-full object-contain"
                src={galleryActive}
                alt={title}
              />
            </div>
          </div>

          <div>
            <h1 className="text-[34px] font-normal sm:text-[42px]">{title}</h1>
            <p className="mt-2 text-2xl font-medium text-muted">{mainPrice}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-5">
              <span className="text-xl text-[#ffc700]">{rating} / 5</span>
              <span className="hidden h-8 w-px bg-muted sm:block"></span>
              <span className="text-sm text-muted">{reviewLabel}</span>
            </div>

            <p className="mt-5 max-w-[424px] text-sm leading-6">
              {shortDescription}
            </p>

            <div className="mt-6">
              <p className="mb-3 text-sm text-muted">Size</p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {sizes.map((size) => (
                  <button
                    key={size.value}
                    className={`h-[30px] w-[30px] rounded ${size.selected ? "bg-brand text-white" : "bg-beige"}`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-sm text-muted">Color</p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {colors.map((color) => (
                  <span
                    key={color.name}
                    className={`h-[30px] w-[30px] rounded-full ${color.selected ? "ring-2 ring-offset-2 ring-brand" : ""}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  ></span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 border-b border-line pb-10 sm:gap-5 sm:pb-14">
              <div className="flex h-16 items-center rounded-[10px] border border-muted">
                <button
                  type="button"
                  className="px-4 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() =>
                    setQuantity((current) =>
                      clampQuantity(current - 1, minQuantity, maxQuantity),
                    )
                  }
                  disabled={quantity <= minQuantity}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-5">{quantity}</span>
                <button
                  type="button"
                  className="px-4 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() =>
                    setQuantity((current) =>
                      clampQuantity(current + 1, minQuantity, maxQuantity),
                    )
                  }
                  disabled={quantity >= maxQuantity}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <Link
                className="inline-flex h-16 w-full items-center justify-center rounded-[15px] border border-black px-8 text-lg hover:bg-black hover:text-white sm:w-auto sm:px-12 sm:text-xl"
                to="#"
                onClick={(event) => {
                  event.preventDefault();
                  if (!detail) {
                    return;
                  }

                  void addToCart({
                    productId: detail.id,
                    slug: detail.slug,
                    name: detail.name,
                    image: detail.gallery.active,
                    price: detail.price,
                    quantity,
                  });
                }}
              >
                {primaryActionLabel}
              </Link>

              <Link
                className="inline-flex h-16 w-full items-center justify-center rounded-[15px] border border-black px-8 text-lg hover:bg-black hover:text-white sm:w-auto sm:px-12 sm:text-xl"
                to="/shop"
              >
                + {compareActionLabel}
              </Link>
            </div>

            <div className="mt-10 grid gap-3 text-muted">
              <p>SKU : {metaSku}</p>
              <p>Category : {metaCategory}</p>
              <p>Tags : {metaTags}</p>
              <p>Share : {shareText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line py-12">
        <div className="mx-auto w-[min(1026px,calc(100%-32px))]">
          <div className="mb-9 flex flex-wrap justify-center gap-5 text-lg sm:gap-10 sm:text-2xl lg:gap-14">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedTabKey(tab.key)}
                aria-pressed={tab.key === activeTab?.key}
                className={
                  tab.key === activeTab?.key
                    ? "font-medium"
                    : "text-muted hover:text-black"
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
          {activeTab?.content.map((paragraph) => (
            <p
              key={paragraph}
              className="mb-7 text-left text-muted sm:text-justify"
            >
              {paragraph}
            </p>
          ))}
          <div className="grid gap-7 md:grid-cols-2">
            <img
              className="h-[348px] w-full rounded-[10px] bg-beige object-cover"
              src="/images/home/home-01.png"
              alt=""
            />
            <img
              className="h-[348px] w-full rounded-[10px] bg-beige object-cover"
              src="/images/home/home-03.png"
              alt=""
            />
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto w-[min(1236px,calc(100%-32px))]">
          <h2 className="mb-7 text-center text-[30px] font-medium sm:text-4xl">
            Related Products
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProductsToRender.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                image={product.image}
                price={product.price}
                originalPrice={product.originalPrice}
                badgeText={product.badgeText}
                badgeType={product.badgeType as "" | "danger" | "fresh"}
                productLink={`/products/${product.slug ?? product.id}`}
                onAddToCart={() =>
                  addToCart({
                    productId: product.id,
                    slug: product.slug ?? String(product.id),
                    name: product.name,
                    image: product.image,
                    price: parsePriceTextToNumber(product.price),
                    quantity: 1,
                  })
                }
                isAddingToCart={isAddingToCart}
              />
            ))}
          </div>

          <div className="mt-11 text-center">
            <Link
              className="inline-flex border border-brand px-10 py-3 font-semibold text-brand hover:bg-brand hover:text-white sm:px-[74px]"
              to="/shop"
            >
              Show More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
