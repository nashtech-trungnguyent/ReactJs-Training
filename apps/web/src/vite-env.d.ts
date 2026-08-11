/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID: string;
  readonly VITE_EMAILJS_TEMPLATE_ID: string;
  readonly VITE_EMAILJS_ORDER_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY: string;
  readonly VITE_CONTACT_CONFIRM_SUBJECT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
