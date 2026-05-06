import { clientApi } from "@/lib/axios/client";
import { WishlistDto, WishlistItemDto } from "@/types/wishlist/wishlist";

export const wishlistService = {
  // GET /wishlists
  getMyWishlist: async (): Promise<WishlistDto> => {
    const res = await clientApi.get(`/wishlists`);
    return res.data.data;
  },

  // POST /wishlists
  create: async (): Promise<WishlistDto> => {
    const res = await clientApi.post(`/wishlists`);
    return res.data.data;
  },

  // GET /wishlists/products
  getProductWishlist: async (): Promise<WishlistItemDto[]> => {
    const res = await clientApi.get(`/wishlists/products`);
    return res.data.data;
  },

  // POST /wishlists/products?productId=...
  addProduct: async (productId: number): Promise<void> => {
    await clientApi.post(`/wishlists/products`, null, {
      params: { productId },
    });
  },

  // DELETE /wishlists/products/{productId}
  removeProduct: async (productId: number): Promise<void> => {
    await clientApi.delete(`/wishlists/products/${productId}`);
  },
};
