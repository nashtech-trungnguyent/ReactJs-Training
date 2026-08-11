import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const CONTACT_CONFIRM_SUBJECT =
  import.meta.env.VITE_CONTACT_CONFIRM_SUBJECT ?? "We received your contact";

export function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      toast.error(
        "Email service is not configured yet. Please set VITE_EMAILJS_* variables.",
      );
      return;
    }

    try {
      await toast.promise(
        emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            user_name: values.name,
            user_email: values.email,
            confirm_subject: CONTACT_CONFIRM_SUBJECT,
            confirm_message:
              "Thank you for contacting Furniro. We have received your message and will respond soon.",
            user_message: values.message,
          },
          {
            publicKey: EMAILJS_PUBLIC_KEY,
          },
        ),
        {
          pending: "Sending confirmation email...",
          success: "Confirmation email has been sent to your inbox.",
          error:
            "Could not send your message right now. Please try again in a few minutes.",
        },
      );

      reset();
    } catch {}
  };

  return (
    <>
      <section className="relative grid min-h-[240px] place-items-center overflow-hidden sm:min-h-[316px]">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/common/common-09.png"
          alt=""
        />
        <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]"></div>
        <div className="relative text-center">
          <img
            className="mx-auto mb-1 h-12 w-12 object-contain"
            src="/images/common/common-01.png"
            alt=""
          />
          <h1 className="text-4xl font-medium sm:text-5xl">Contact</h1>
          <p className="mt-3 font-medium">
            <Link to="/">Home</Link> <span className="mx-1">&gt;</span>
            <span className="font-light">Contact</span>
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-24">
        <div className="mx-auto w-[min(1058px,calc(100%-32px))]">
          <div className="mx-auto mb-20 max-w-[644px] text-center">
            <h2 className="text-[30px] font-semibold sm:text-4xl">
              Get In Touch With Us
            </h2>
            <p className="mt-2 text-muted">
              For more information about our product and services, please feel
              free to drop us an email. Our staff will always be there to help
              you out.
            </p>
          </div>

          <div className="grid gap-14 lg:grid-cols-[393px_1fr]">
            <aside className="grid content-start gap-10 px-0 sm:px-4 lg:px-8">
              <div>
                <h3 className="text-2xl font-medium">Address</h3>
                <p className="mt-2 max-w-[212px]">
                  236 5th SE Avenue, New York NY10000, United States
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-medium">Phone</h3>
                <p className="mt-2">
                  Mobile: +(84) 546-6789
                  <br />
                  Hotline: +(84) 456-6789
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-medium">Working Time</h3>
                <p className="mt-2">
                  Monday-Friday: 9:00 - 22:00
                  <br />
                  Saturday-Sunday: 9:00 - 21:00
                </p>
              </div>
            </aside>

            <form className="grid gap-9" onSubmit={handleSubmit(onSubmit)}>
              <label className="grid gap-5 font-medium">
                Your name
                <input
                  {...register("name", {
                    required: "Please enter your name.",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters.",
                    },
                  })}
                  aria-invalid={Boolean(errors.name)}
                  autoComplete="name"
                  className="h-[75px] rounded-[10px] border border-muted px-8 font-normal"
                  placeholder="Abc"
                />
                {errors.name ? (
                  <span className="text-sm font-normal text-danger">
                    {errors.name.message}
                  </span>
                ) : null}
              </label>

              <label className="grid gap-5 font-medium">
                Email address
                <input
                  {...register("email", {
                    required: "Please enter your email address.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address.",
                    },
                  })}
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                  className="h-[75px] rounded-[10px] border border-muted px-8 font-normal"
                  placeholder="abc@def.com"
                  type="email"
                />
                {errors.email ? (
                  <span className="text-sm font-normal text-danger">
                    {errors.email.message}
                  </span>
                ) : null}
              </label>

              <label className="grid gap-5 font-medium">
                Subject
                <input
                  {...register("subject", {
                    maxLength: {
                      value: 120,
                      message: "Subject cannot exceed 120 characters.",
                    },
                  })}
                  aria-invalid={Boolean(errors.subject)}
                  className="h-[75px] rounded-[10px] border border-muted px-8 font-normal"
                  placeholder="This is optional"
                />
                {errors.subject ? (
                  <span className="text-sm font-normal text-danger">
                    {errors.subject.message}
                  </span>
                ) : null}
              </label>

              <label className="grid gap-5 font-medium">
                Message
                <textarea
                  {...register("message", {
                    required: "Please enter your message.",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters.",
                    },
                  })}
                  aria-invalid={Boolean(errors.message)}
                  className="min-h-[120px] rounded-[10px] border border-muted px-8 py-6 font-normal"
                  placeholder="Hi, I would like to ask about"
                ></textarea>
                {errors.message ? (
                  <span className="text-sm font-normal text-danger">
                    {errors.message.message}
                  </span>
                ) : null}
              </label>

              <button
                disabled={isSubmitting}
                className="h-[55px] w-full rounded bg-brand text-white hover:bg-[#9d7626] sm:w-[237px]"
                type="submit"
              >
                {isSubmitting ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>
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
