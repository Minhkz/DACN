export type WishlistItemDto = {
  productId: number;
  productName: string;
  avatar: string;
  price: number;
};

export type WishlistProductDto = {
  id: number;
  userId: number;
  items: WishlistItemDto[];
};

export type WishlistDto = {
  id: number;
  userId: number;
};
