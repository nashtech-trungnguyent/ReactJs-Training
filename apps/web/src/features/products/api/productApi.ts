import { api } from "../../../api";
import {
  ProductDetailApiResponse,
  ProductDetailListApiResponse,
  ProductCardListResponse,
  ProductCardResponse,
  ProductListApiResponse,
} from "../types";

const API_ENDPOINTS = {
  PRODUCT_LIST: "/c/abbb-80dc-4582-8e14",
  PRODUCT_DETAIL: "/c/c5ff-6d32-4ec1-ad63",
} as const;

function getDiscountPercentage(
  price: number,
  originalPrice: number,
): ProductCardResponse["discountPercentage"] {
  if (originalPrice <= price) {
    return 0;
  }

  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function getBadgeType(badge: string): ProductCardResponse["badgeType"] {
  switch (badge.toLowerCase()) {
    case "new":
      return "fresh";

    case "sale":
      return "danger";

    default:
      return "";
  }
}

export const productApi = {
  async getProducts(): Promise<ProductCardListResponse> {
    const response = await api.get<ProductListApiResponse>(
      API_ENDPOINTS.PRODUCT_LIST,
    );

    const { items, total } = response;

    const mappedItems: ProductCardResponse[] = items.map((item) => {
      const discountPercentage = getDiscountPercentage(
        item.price,
        item.originalPrice,
      );

      return {
        ...item,
        discountPercentage,
        badgeType: getBadgeType(item.badge),
      };
    });

    return {
      items: mappedItems,
      total,
    };
  },

  async getProductDetail(
    productKey: string | number,
  ): Promise<ProductDetailApiResponse> {
    const detailResponse = await api.get<ProductDetailListApiResponse>(
      API_ENDPOINTS.PRODUCT_DETAIL,
    );

    const normalizedKey = String(productKey).toLowerCase();

    const detailItem = detailResponse.items.find(
      (product) =>
        product.slug.toLowerCase() === normalizedKey ||
        String(product.id) === normalizedKey,
    );

    if (detailItem) {
      return detailItem;
    }

    throw new Error(`Product detail not found for key ${productKey}`);
  },
};
