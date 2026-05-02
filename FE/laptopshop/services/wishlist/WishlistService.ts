import { clientApi } from "@/lib/axios/client";
import { WishlistDto, WishlistItemDto } from "@/types/wishlist/wishlist";

export const wishlistService = {
  getByUserId: async (userId: number): Promise<WishlistDto> => {
    const res = await clientApi.get(`/wishlists/users/${userId}`);
    return res.data.data;
  },

  addProduct: async (wishlistId: number, productId: number): Promise<void> => {
    await clientApi.post(`/wishlists/${wishlistId}/products`, null, {
      params: { productId },
    });
  },

  removeProduct: async (
    wishlistId: number,
    productId: number,
  ): Promise<void> => {
    await clientApi.delete(`/wishlists/${wishlistId}/products/${productId}`);
  },

  check: async (userId: number, productId: number): Promise<boolean> => {
    const res = await clientApi.get(`/wishlists/${userId}/check/${productId}`);
    return res.data.data;
  },
  getProducts: async (wishlistId: number): Promise<WishlistItemDto[]> => {
    const res = await clientApi.get(`/wishlists/${wishlistId}/products`);
    return res.data.data;
  },

  create: async (userId: number) => {
    const res = await clientApi.post(`/wishlists/users/${userId}`);
    return res.data.data;
  },
};
