import { CategoryRequest } from '@/types/category/CategoryRequest';
import { CategoryType } from '@/types/category/CategoryType';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/filters';

const getAll = async (): Promise<CategoryType[]> => {
  const res = await axios.get(BASE_URL);
  return res.data.data;
};

const create = async (category: CategoryRequest): Promise<CategoryType> => {
  const res = await axios.post(BASE_URL, category);
  return res.data.data;
};

const remove = async (categoryId: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${categoryId}`);
};

const update = async (
  categoryId: number,
  category: CategoryRequest
): Promise<CategoryType> => {
  const res = await axios.put(`${BASE_URL}/${categoryId}`, category);
  return res.data.data;
};

const detail = async (categoryId: number): Promise<CategoryType> => {
  const res = await axios.get(`${BASE_URL}/${categoryId}`);
  return res.data.data;
};

export { getAll, create, remove, update, detail };
