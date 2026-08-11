import { useQuery } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import { ProductDetailApiResponse } from "../types";

export function useProductDetail(productKey?: string) {
  return useQuery<ProductDetailApiResponse>({
    queryKey: ["product-detail", productKey],
    queryFn: () => productApi.getProductDetail(productKey as string),
    enabled: Boolean(productKey),
  });
}
