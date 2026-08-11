import { Link } from "react-router-dom";

type ProductCardProps = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  originalPrice?: string;
  badgeText?: string;
  badgeType?: "danger" | "fresh" | "";
  productLink?: string;
  onAddToCart?: () => void | Promise<unknown>;
  isAddingToCart?: boolean;
};

export default function ProductCard({
  id,
  name,
  description,
  image,
  price,
  originalPrice,
  badgeText,
  badgeType = "",
  productLink,
  onAddToCart,
  isAddingToCart = false,
}: ProductCardProps) {
  return (
    <article className="group relative overflow-hidden bg-product">
      <Link to={productLink ?? `/products/${id}`}>
        <img className="h-[301px] w-full object-cover" src={image} alt={name} />
      </Link>

      {badgeText && badgeType ? (
        <span
          className={`absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full text-base font-medium text-white ${
            badgeType === "fresh" ? "bg-fresh" : "bg-danger"
          }`}
        >
          {badgeText}
        </span>
      ) : null}

      <div className="p-4">
        <h3 className="text-2xl font-semibold text-dark">{name}</h3>
        <p className="mt-2 font-medium text-[#898989]">{description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <strong className="text-xl font-semibold text-dark">{price}</strong>
          {originalPrice ? (
            <span className="text-base text-[#b0b0b0] line-through">
              {originalPrice}
            </span>
          ) : null}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 hidden place-items-center bg-[#3a3a3a]/70 group-hover:grid">
        <div className="pointer-events-auto grid justify-items-center gap-6">
          {onAddToCart ? (
            <button
              type="button"
              className="bg-white px-14 py-3 font-semibold text-brand disabled:cursor-not-allowed disabled:opacity-70"
              onClick={onAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? "Adding..." : "Add to cart"}
            </button>
          ) : (
            <Link
              className="bg-white px-14 py-3 font-semibold text-brand"
              to="/cart"
            >
              Add to cart
            </Link>
          )}
          <div className="flex gap-5 text-white">
            <span>Share</span>
            <span>Compare</span>
            <span>Like</span>
          </div>
        </div>
      </div>
    </article>
  );
}
