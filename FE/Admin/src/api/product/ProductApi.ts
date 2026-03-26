import { ProductDetailDto } from '@/types/product/ProductDetailDto';
import { ProductDto } from '@/types/product/ProductDto';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/products';

const getAll = async (): Promise<ProductDetailDto[]> => {
  const res = await axios.get(BASE_URL);
  return res.data.data;
};
const create = async (formData: FormData): Promise<ProductDto> => {
  const res = await axios.post(BASE_URL, formData);
  return res.data.data;
};

const remove = async (productId: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${productId}`);
};

const detail = async (productId: number): Promise<ProductDetailDto> => {
  const res = await axios.get(`${BASE_URL}/${productId}`);
  return res.data.data;
};

const update = async (
  productId: number,
  formData: FormData
): Promise<ProductDetailDto> => {
  const res = await axios.put(`${BASE_URL}/${productId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.data;
};
export { getAll, create, remove, detail, update };
