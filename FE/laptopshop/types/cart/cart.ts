export type CartItemDto = {
  productId: number;
  productName: string;
  avatar: string;
  price: number;
  qty: number;
};

export type CartProductDto = {
  id: number;
  userId: number;
  username: string;
  totalPrice: number;
  items: CartItemDto[];
};

export type CartDto = {
  id: number;
  userId: number;
};
