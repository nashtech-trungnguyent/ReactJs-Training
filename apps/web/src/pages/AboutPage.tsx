import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <>
      <section className="relative grid min-h-[240px] place-items-center overflow-hidden sm:min-h-[316px]">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/home/home-20.png"
          alt=""
        />
        <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]"></div>
        <div className="relative text-center">
          <img
            className="mx-auto mb-1 h-12 w-12 object-contain"
            src="/images/common/common-01.png"
            alt=""
          />
          <h1 className="text-4xl font-medium sm:text-5xl">About</h1>
          <p className="mt-3 font-medium">
            <Link to="/">Home</Link> <span className="mx-1">&gt;</span>
            <span className="font-light">About</span>
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] items-center gap-12 lg:grid-cols-2">
          <img
            className="h-[340px] w-full rounded-[10px] object-cover sm:h-[520px]"
            src="/images/home/home-07.jpg"
            alt="Furniro showroom"
          />
          <div>
            <p className="mb-3 font-semibold tracking-[3px] text-brand">
              Furniro Studio
            </p>
            <h2 className="mb-6 text-[32px] font-bold leading-tight sm:text-[42px]">
              Designed around calm, useful rooms.
            </h2>
            <p className="mb-5 leading-8 text-muted">
              Furniro brings together room-ready furniture, soft materials, and
              simple silhouettes inspired by the original interior commerce
              design.
            </p>
            <p className="leading-8 text-muted">
              The collection covers living, dining, bedroom, and decorative
              essentials with consistent quality and support.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-beige py-16">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 md:grid-cols-3">
          <article className="bg-white p-8">
            <h3 className="mb-3 text-2xl font-semibold">Premium Material</h3>
            <p className="text-muted">
              Durable surfaces and textiles made for daily use.
            </p>
          </article>
          <article className="bg-white p-8">
            <h3 className="mb-3 text-2xl font-semibold">Room Collections</h3>
            <p className="text-muted">
              Coordinated pieces for fast and confident styling.
            </p>
          </article>
          <article className="bg-white p-8">
            <h3 className="mb-3 text-2xl font-semibold">Reliable Support</h3>
            <p className="text-muted">
              Delivery, warranty, and care help when you need it.
            </p>
          </article>
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
