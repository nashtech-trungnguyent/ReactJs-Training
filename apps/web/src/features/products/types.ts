export type ProductApiResponse = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  thumbnail: string;
  badge: string;
  rating: number;
  shortDescription: string;
  tags: string[];
};

export type ProductListApiResponse = {
  items: ProductApiResponse[];
  total: number;
};

export type ProductCardResponse = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  thumbnail: string;
  badge: string;
  badgeType: "danger" | "fresh" | "";
  rating: number;
  discountPercentage: number;
  shortDescription: string;
  tags: string[];
};

export type ProductCardListResponse = {
  items: ProductCardResponse[];
  total: number;
};

export type ProductDetailRelatedApiResponse = {
  id: number;
  slug: string;
  name: string;
  priceText: string;
  originalPriceText?: string;
  thumbnail: string;
  badge?: string;
};

export type ProductDetailBreadcrumbApiResponse = {
  label: string;
  href?: string;
};

export type ProductDetailSizeApiResponse = {
  label: string;
  value: string;
  selected?: boolean;
};

export type ProductDetailColorApiResponse = {
  name: string;
  value: string;
  selected?: boolean;
};

export type ProductDetailQuantityApiResponse = {
  default: number;
  min: number;
  max: number;
};

export type ProductDetailActionButtonApiResponse = {
  label: string;
  icon?: string;
};

export type ProductDetailActionsApiResponse = {
  primary: ProductDetailActionButtonApiResponse;
  secondary?: ProductDetailActionButtonApiResponse[];
};

export type ProductDetailShareApiResponse = {
  platform: string;
  label: string;
};

export type ProductDetailTabApiResponse = {
  key: string;
  label: string;
  active?: boolean;
  content: string[];
};

export type ProductDetailApiResponse = {
  id: number;
  slug: string;
  name: string;
  breadcrumb?: ProductDetailBreadcrumbApiResponse[];
  category: string;
  price: number;
  priceText?: string;
  originalPrice?: number;
  originalPriceText?: string;
  rating: number;
  ratingCount: number;
  reviewLabel?: string;
  shortDescription: string;
  gallery: {
    active: string;
    thumbnails: string[];
  };
  sizes?: ProductDetailSizeApiResponse[];
  colors?: ProductDetailColorApiResponse[];
  quantity?: ProductDetailQuantityApiResponse;
  actions?: ProductDetailActionsApiResponse;
  detailImages: string[];
  meta: {
    sku: string;
    category: string;
    tags: string[];
  };
  share?: ProductDetailShareApiResponse[];
  tabs?: ProductDetailTabApiResponse[];
  relatedProducts: ProductDetailRelatedApiResponse[];
};

export type ProductDetailListApiResponse = {
  items: ProductDetailApiResponse[];
};
