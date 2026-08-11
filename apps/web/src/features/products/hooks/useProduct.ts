import { useQuery } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import { ProductCardListResponse } from "../types";

export function useProducts() {
  return useQuery<ProductCardListResponse>({
    queryKey: ["products"],
    queryFn: () => productApi.getProducts(),
    select: (response) => response,
  });
}
