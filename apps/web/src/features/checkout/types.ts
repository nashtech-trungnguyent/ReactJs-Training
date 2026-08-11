export type CheckoutCartItemPayload = {
  productId: number;
  quantity: number;
};

export type CheckoutPayload = {
  firstName: string;
  lastName: string;
  companyName?: string;
  country: string;
  streetAddress: string;
  city: string;
  province: string;
  zipCode: string;
  phone: string;
  email: string;
  additionalInfo?: string;
  paymentMethod: "bank-transfer" | "cash-on-delivery";
  items: CheckoutCartItemPayload[];
};

export type CheckoutResponse = {
  success: boolean;
  orderId: string;
  status: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
};
