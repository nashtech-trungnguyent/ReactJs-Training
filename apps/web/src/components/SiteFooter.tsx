import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white pt-12">
      <div className="mx-auto grid w-[min(1240px,calc(100%-32px))] gap-10 pb-12 lg:grid-cols-[2fr_1fr_1fr_2fr]">
        <div>
          <h2 className="mb-12 text-2xl font-bold">Furniro.</h2>
          <p className="max-w-[285px] text-muted">
            400 University Drive Suite 200 Coral Gables, FL 33134 USA
          </p>
        </div>
        <div>
          <h3 className="mb-10 text-muted">Links</h3>
          <div className="grid gap-9 font-medium">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-10 text-muted">Help</h3>
          <div className="grid gap-9 font-medium">
            <Link to="#">Payment Options</Link>
            <Link to="#">Returns</Link>
            <Link to="#">Privacy Policies</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-10 text-muted">Newsletter</h3>
          <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              className="min-w-0 flex-1 border-b border-black py-1 text-sm outline-none"
              placeholder="Enter Your Email Address"
            />
            <button
              className="border-b border-black py-1 text-sm font-medium uppercase"
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="mx-auto w-[min(1240px,calc(100%-32px))] border-t border-line py-9 text-sm">
        2026 Furniro. All rights reserved
      </div>
    </footer>
  );
}
