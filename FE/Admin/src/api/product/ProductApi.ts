import { ProductDetailDto } from '@/types/product/ProductDetailDto';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/products';

const getAll = async (): Promise<ProductDetailDto[]> => {
  const res = await axios.get(BASE_URL);
  return res.data.data;
};

export { getAll };
