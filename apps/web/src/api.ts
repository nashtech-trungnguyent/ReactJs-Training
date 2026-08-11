import { createHttpClient } from "@react-workshop/http-client";

export const api = createHttpClient({
  baseURL: "https://dummyjson.com",
  timeout: 10_000,
});
