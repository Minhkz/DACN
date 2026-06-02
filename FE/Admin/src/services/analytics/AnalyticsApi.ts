import { clientApi } from '@/lib/axios/client';
import { ResponseResult } from '@/types/common/ResponseResult';
import {
  AbandonedCartDto,
  CartAdditionStatsDto,
  ProductViewStatsDto,
} from '@/types/analytics/analytics';

export const getProductViews = async (
  limit: number = 10
): Promise<ProductViewStatsDto[]> => {
  const res = await clientApi.get<ResponseResult<ProductViewStatsDto[]>>(
    `/analytics/product-views?limit=${limit}`
  );

  return res.data.data;
};

export const getCartAdditions = async (
  limit: number = 10
): Promise<CartAdditionStatsDto[]> => {
  const res = await clientApi.get<ResponseResult<CartAdditionStatsDto[]>>(
    `/analytics/cart-additions?limit=${limit}`
  );

  return res.data.data;
};

export const getAbandonedCarts = async (
  hours: number = 24
): Promise<AbandonedCartDto[]> => {
  const res = await clientApi.get<ResponseResult<AbandonedCartDto[]>>(
    `/analytics/abandoned-carts?hours=${hours}`
  );

  return res.data.data;
};
