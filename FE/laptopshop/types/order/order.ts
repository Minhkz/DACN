import { ProductDetailDto } from "../product/ProductDetailDto";

export type CreateOrderRequest = {
  shippingAddress: string;
  paymentMethod: string;
  products: number[];
};

export type OrderDto = {
  id: number;

  userId: number;

  username: string;

  status: string;

  totalPrice: number;

  shippingAddress: string;

  paymentMethod: string;

  createdDate: string;

  items: OrderItemDto[];
};

export type OrderItemDto = {
  id: number;

  productId: number;

  productName: string;

  productAvatar: string;

  price: number;

  product: ProductDetailDto;

  quantity: number;

  subTotal: number;
};

export type OrderProductRequest = {
  productId: number;
  qty: number;
};

export type OrderRequest = {
  shippingAddress: string;
  paymentMethod: string;
  products: OrderProductRequest[];
};
