import { clientApi } from '@/lib/axios/client';
import { PaginationResponse } from '@/types/common/PaginationResponse';
import { ProductDetailDto } from '@/types/product/ProductDetailDto';
import { ProductDto } from '@/types/product/ProductDto';

const getAll = async (
  page: number,
  size: number
): Promise<PaginationResponse<ProductDetailDto[]>> => {
  const res = await clientApi.get('/products', {
    params: {
      page,
      size,
      sort: 'id.desc',
    },
  });

  return res.data.data;
};
const create = async (formData: FormData): Promise<ProductDto> => {
  const res = await clientApi.post('/products', formData);
  return res.data.data;
};

const remove = async (productId: number): Promise<void> => {
  await clientApi.delete(`/products/${productId}`);
};

const detail = async (productId: number): Promise<ProductDetailDto> => {
  const res = await clientApi.get(`/products/${productId}`);
  return res.data.data;
};

const update = async (
  productId: number,
  formData: FormData
): Promise<ProductDetailDto> => {
  const res = await clientApi.put(`/products/${productId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.data;
};
export { getAll, create, remove, detail, update };
