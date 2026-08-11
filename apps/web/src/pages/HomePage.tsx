import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useAddToCart } from "../features/cart/hooks/useAddToCart";

const homeProducts = [
  {
    id: 1,
    name: "Syltherine",
    description: "Stylish cafe chair",
    image: "/images/product/product-01.png",
    price: "Rp 2.500.000",
    priceValue: 2500000,
    slug: "syltherine",
    originalPrice: "Rp 3.500.000",
    badgeText: "-30%",
    badgeType: "danger",
  },
  {
    id: 2,
    name: "Leviosa",
    description: "Stylish cafe chair",
    image: "/images/product/product-02.png",
    price: "Rp 2.500.000",
    priceValue: 2500000,
    slug: "leviosa",
    badgeText: "",
    badgeType: "",
  },
  {
    id: 3,
    name: "Lolito",
    description: "Luxury big sofa",
    image: "/images/product/product-03.jpg",
    price: "Rp 7.000.000",
    priceValue: 7000000,
    slug: "lolito",
    originalPrice: "Rp 14.000.000",
    badgeText: "-50%",
    badgeType: "danger",
  },
  {
    id: 4,
    name: "Respira",
    description: "Outdoor bar table and stool",
    image: "/images/product/product-04.png",
    price: "Rp 500.000",
    priceValue: 500000,
    slug: "respira",
    badgeText: "New",
    badgeType: "fresh",
  },
  {
    id: 5,
    name: "Grifo",
    description: "Night lamp",
    image: "/images/product/product-05.png",
    price: "Rp 1.500.000",
    priceValue: 1500000,
    slug: "grifo",
    badgeText: "",
    badgeType: "",
  },
  {
    id: 6,
    name: "Muggo",
    description: "Small mug",
    image: "/images/product/product-06.png",
    price: "Rp 150.000",
    priceValue: 150000,
    slug: "muggo",
    badgeText: "New",
    badgeType: "fresh",
  },
  {
    id: 7,
    name: "Pingky",
    description: "Cute bed set",
    image: "/images/product/product-07.png",
    price: "Rp 7.000.000",
    priceValue: 7000000,
    slug: "pingky",
    originalPrice: "Rp 14.000.000",
    badgeText: "-50%",
    badgeType: "danger",
  },
  {
    id: 8,
    name: "Potty",
    description: "Minimalist flower pot",
    image: "/images/product/product-08.png",
    price: "Rp 500.000",
    priceValue: 500000,
    slug: "potty",
    badgeText: "New",
    badgeType: "fresh",
  },
];

export default function HomePage() {
  const { addToCart, isAddingToCart } = useAddToCart();

  return (
    <>
      <section className="relative min-h-[560px] overflow-hidden bg-beige md:min-h-[716px]">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/home/home-22.jpg"
          alt="Interior room"
        />
        <div className="relative mx-auto grid min-h-[560px] w-[min(1240px,calc(100%-32px))] items-center justify-items-start py-10 md:min-h-[716px] md:justify-items-end md:py-12">
          <div className="w-full max-w-[643px] rounded-[10px] bg-cream px-6 py-8 sm:px-8 md:px-14 md:py-16">
            <p className="mb-1 font-semibold tracking-[3px]">New Arrival</p>
            <h1 className="mb-4 text-[32px] font-bold leading-[1.2] text-brand sm:text-[40px] md:text-[52px]">
              Discover Our New Collection
            </h1>
            <p className="mb-8 text-base font-medium leading-6 md:mb-11 md:text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis.
            </p>
            <Link
              className="inline-flex w-full justify-center bg-brand px-8 py-4 text-sm font-bold uppercase text-white hover:bg-[#9d7626] sm:w-auto sm:px-[72px] sm:py-6"
              to="/shop"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </section>
      <section className="py-12 md:py-14">
        <div className="mx-auto w-[min(1183px,calc(100%-32px))]">
          <div className="mb-12 section text-center">
            <h2 className="text-[28px] font-bold text-[#333] md:text-[32px]">
              Browse The Range
            </h2>
            <p className="text-base text-[#666] md:text-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <Link to="/shop" className="text-center">
              <img
                className="h-[320px] w-full rounded-[10px] object-cover sm:h-[420px] md:h-[480px]"
                src="/images/home/home-04.png"
                alt="Dining"
              />
              <h3 className="mt-7 text-2xl font-semibold text-[#333]">
                Dining
              </h3>
            </Link>
            <Link to="/shop" className="text-center">
              <img
                className="h-[320px] w-full rounded-[10px] object-cover sm:h-[420px] md:h-[480px]"
                src="/images/home/home-08.png"
                alt="Living"
              />
              <h3 className="mt-7 text-2xl font-semibold text-[#333]">
                Living
              </h3>
            </Link>
            <Link to="/shop" className="text-center">
              <img
                className="h-[320px] w-full rounded-[10px] object-cover sm:h-[420px] md:h-[480px]"
                src="/images/home/home-12.png"
                alt="Bedroom"
              />
              <h3 className="mt-7 text-2xl font-semibold text-[#333]">
                Bedroom
              </h3>
            </Link>
          </div>
        </div>
      </section>
      <section className="pb-16">
        <div className="mx-auto w-[min(1236px,calc(100%-32px))]">
          <h2 className="mb-8 text-center text-[30px] font-bold text-dark md:text-[40px]">
            Our Products
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {homeProducts.map((product) => (
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
                productLink={`/products/${product.id}`}
                onAddToCart={() =>
                  addToCart({
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    image: product.image,
                    price: product.priceValue,
                    quantity: 1,
                  })
                }
                isAddingToCart={isAddingToCart}
              />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              to="/shop"
              className="inline-flex border border-brand px-10 py-3 font-semibold text-brand hover:bg-[#fbf7ef] sm:px-20"
            >
              Show More
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-[#fcf8f3] py-11">
        <div className="mx-auto grid w-[min(1240px,calc(100%-32px))] items-center gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <h2 className="text-[30px] font-bold leading-tight text-dark md:text-[40px]">
              50+ Beautiful rooms inspiration
            </h2>
            <p className="mt-2 max-w-[370px] font-medium leading-6 text-[#616161]">
              Our designer already made a lot of beautiful prototype of rooms
              that inspire you.
            </p>
            <Link
              className="mt-6 inline-flex bg-brand px-9 py-3 font-semibold text-white"
              to="/shop"
            >
              Explore More
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-[404px_1fr]">
            <div className="relative">
              <img
                className="h-[420px] w-full object-cover sm:h-[582px]"
                src="/images/home/home-10.png"
                alt="Room inspiration"
              />
              <div className="absolute bottom-4 left-4 right-4 flex max-w-full sm:bottom-6 sm:left-6 sm:right-auto">
                <div className="bg-white/80 px-4 py-4 sm:px-8 sm:py-8">
                  <p className="text-[#616161]">01 - Bed Room</p>
                  <h3 className="mt-2 text-[22px] font-semibold text-dark sm:text-[28px]">
                    Inner Peace
                  </h3>
                </div>
                <div className="grid w-12 place-items-center self-end bg-brand py-4 text-white">
                  -&gt;
                </div>
              </div>
            </div>

            <img
              className="hidden h-[486px] w-full object-cover md:block"
              src="/images/home/home-11.png"
              alt="Room"
            />
          </div>
        </div>
      </section>
    </>
  );
}
