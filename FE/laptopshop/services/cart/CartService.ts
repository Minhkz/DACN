import { clientApi } from "@/lib/axios/client";
import { CartDto, CartItemDto } from "@/types/cart/cart";
import { clear } from "console";
import { create } from "domain";
import { get } from "http";

export const cartService = {
  getMyCart: async (): Promise<CartDto> => {
    const res = await clientApi.get(`/carts`);
    return res.data.data;
  },

  getProductCart: async (): Promise<CartItemDto[]> => {
    const res = await clientApi.get(`/carts/products`);
    return res.data.data;
  },

  create: async (): Promise<CartDto> => {
    const res = await clientApi.post(`/carts`);
    return res.data.data;
  },

  addProduct: async (productId: number, quantity: number): Promise<void> => {
    await clientApi.post(`/carts/products`, null, {
      params: { productId, quantity },
    });
  },

  updateQuantityProduct: async (
    productId: number,
    quantity: number,
  ): Promise<void> => {
    await clientApi.patch(`/carts/products/${productId}`, null, {
      params: { quantity },
    });
  },

  removeProduct: async (productId: number): Promise<void> => {
    await clientApi.delete(`/carts/products/${productId}`);
  },

  clear: async (): Promise<void> => {
    await clientApi.delete(`/carts/clear`);
  },
};
