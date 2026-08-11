import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../features/cart/hooks/useCart";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: cartData } = useCart();
  const cartCount = cartData?.items.length ?? 0;

  return (
    <header className="bg-white">
      <nav className="mx-auto flex w-[min(1240px,calc(100%-32px))] flex-wrap items-center gap-4 py-4 lg:min-h-[100px] lg:gap-6 lg:py-0">
        <NavLink
          className="flex shrink-0 items-center gap-2 text-[28px] font-bold leading-none sm:text-[34px] lg:flex-1"
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <img
            className="h-8 w-8 object-contain sm:h-9 sm:w-9"
            src="/images/common/common-01.png"
            alt=""
          />
          Furniro
        </NavLink>

        <div className="hidden items-center gap-[72px] text-base font-medium lg:flex lg:flex-1 lg:justify-center">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "text-brand hover:text-brand" : "hover:text-brand"
              }
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 text-black sm:gap-4 lg:ml-0 lg:flex-1 lg:justify-end lg:gap-6">
          <button
            className="grid h-10 w-10 place-items-center rounded border border-line lg:hidden"
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6 6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>

          <button
            className="hidden h-10 w-10 place-items-center hover:text-brand md:grid"
            type="button"
            aria-label="Account"
          >
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          <button
            className="hidden h-10 w-10 place-items-center hover:text-brand md:grid"
            type="button"
            aria-label="Search"
          >
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>

          <button
            className="hidden h-10 w-10 place-items-center hover:text-brand md:grid"
            type="button"
            aria-label="Wishlist"
          >
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
            </svg>
          </button>

          <NavLink
            className="relative grid h-10 w-10 place-items-center hover:text-brand"
            to="/cart"
            aria-label="Cart"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 8h15l-2 9H8L6 8Z" />
              <path d="M6 8 5 4H2" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>

            {cartCount > 0 ? (
              <span className="absolute right-0 top-0 grid min-h-5 min-w-5 -translate-y-1/4 translate-x-1/4 place-items-center rounded-full bg-brand px-1 text-xs font-semibold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </NavLink>
        </div>

        <div
          className={`${isMobileMenuOpen ? "grid" : "hidden"} order-3 w-full gap-3 border-t border-line pt-4 text-sm font-medium lg:hidden`}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "rounded-[10px] bg-beige px-4 py-3 text-brand hover:text-brand"
                  : "rounded-[10px] px-4 py-3 hover:bg-beige hover:text-brand"
              }
              end={item.to === "/"}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
