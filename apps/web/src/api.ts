import { createHttpClient } from "@react-workshop/http-client";

const apiBaseUrl = import.meta.env.DEV ? "https://dummyjson.com" : "/dummyjson";

export const api = createHttpClient({
  baseURL: apiBaseUrl,
  timeout: 10_000,
});
