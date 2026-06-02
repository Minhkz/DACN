export type ProductViewStatsDto = {
  productId: number;
  productName: string;
  productAvatar: string;
  viewCount: number;
};

export type CartAdditionStatsDto = {
  productId: number;
  productName: string;
  productAvatar: string;
  addToCartCount: number;
  totalQuantity: number;
};

export type AbandonedCartItemDto = {
  productId: number;
  productName: string;
  productAvatar: string;
  quantity: number;
  price: number;
  subTotal: number;
};

export type AbandonedCartDto = {
  cartId: number;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  lastCartActivity: string | null;
  totalAmount: number;
  items: AbandonedCartItemDto[];
};
