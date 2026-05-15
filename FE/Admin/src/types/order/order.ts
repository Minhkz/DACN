export type OrderAdminDto = {
  id: number;

  userId: number | null;
  username: string | null;
  fullName: string | null;
  email: string | null;

  status: string;
  paymentMethod: string;
  paymentStatus: string;

  shippingAddress: string;
  phone: string;

  createdDate: string;

  products: OrderAdminItemDto[];
};

export type OrderAdminItemDto = {
  id: number;
  productId: number | null;
  productName: string | null;
  productAvatar: string | null;
  price: number;
  quantity: number;
};

export type OrderStatusUpdateRequest = {
  status: string;
};
