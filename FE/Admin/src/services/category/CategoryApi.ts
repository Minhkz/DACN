import { clientApi } from '@/lib/axios/client';
import { CategoryRequest } from '@/types/category/CategoryRequest';
import { CategoryType } from '@/types/category/CategoryType';
import axios from 'axios';

const getAll = async (): Promise<CategoryType[]> => {
  const res = await clientApi.get('/categories');
  return res.data.data;
};

const create = async (category: CategoryRequest): Promise<CategoryType> => {
  const res = await clientApi.post('/categories', category);
  return res.data.data;
};

const remove = async (categoryId: number): Promise<void> => {
  await clientApi.delete(`/categories/${categoryId}`);
};

const update = async (
  categoryId: number,
  category: CategoryRequest
): Promise<CategoryType> => {
  const res = await clientApi.put(`/categories/${categoryId}`, category);
  return res.data.data;
};

const detail = async (categoryId: number): Promise<CategoryType> => {
  const res = await clientApi.get(`/categories/${categoryId}`);
  return res.data.data;
};

export { getAll, create, remove, update, detail };
