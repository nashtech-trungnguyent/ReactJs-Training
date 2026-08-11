import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white pt-12">
      <div className="mx-auto grid w-[min(1240px,calc(100%-32px))] gap-10 pb-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_2fr]">
        <div>
          <h2 className="mb-6 text-2xl font-bold md:mb-12">Furniro.</h2>
          <p className="max-w-[285px] text-muted">
            400 University Drive Suite 200 Coral Gables, FL 33134 USA
          </p>
        </div>
        <div>
          <h3 className="mb-6 text-muted md:mb-10">Links</h3>
          <div className="grid gap-5 font-medium md:gap-9">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-6 text-muted md:mb-10">Help</h3>
          <div className="grid gap-5 font-medium md:gap-9">
            <Link to="#">Payment Options</Link>
            <Link to="#">Returns</Link>
            <Link to="#">Privacy Policies</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-6 text-muted md:mb-10">Newsletter</h3>
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="min-w-0 flex-1 border-b border-black py-1 text-sm outline-none"
              placeholder="Enter Your Email Address"
            />
            <button
              className="self-start border-b border-black py-1 text-sm font-medium uppercase sm:self-auto"
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="mx-auto w-[min(1240px,calc(100%-32px))] border-t border-line py-6 text-center text-sm md:py-9 md:text-left">
        2026 Furniro. All rights reserved
      </div>
    </footer>
  );
}
