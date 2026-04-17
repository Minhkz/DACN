import { clientApi } from '@/lib/axios/client';
import { CategoryRequest } from '@/types/category/CategoryRequest';
import { CategoryType } from '@/types/category/CategoryType';
import { PaginationResponse } from '@/types/common/PaginationResponse';
import axios from 'axios';

const getAll = async (
  page: number,
  size: number
): Promise<PaginationResponse<CategoryType[]>> => {
  const res = await clientApi.get('/filters', {
    params: {
      page,
      size,
      sort: 'id.desc',
    },
  });

  return res.data.data;
};

const getList = async (): Promise<CategoryType[]> => {
  const res = await clientApi.get('/filters/all');
  return res.data.data;
};

const create = async (category: CategoryRequest): Promise<CategoryType> => {
  const res = await clientApi.post('/filters', category);
  return res.data.data;
};

const remove = async (categoryId: number): Promise<void> => {
  await clientApi.delete(`/filters/${categoryId}`);
};

const update = async (
  categoryId: number,
  category: CategoryRequest
): Promise<CategoryType> => {
  const res = await clientApi.put(`/filters/${categoryId}`, category);
  return res.data.data;
};

const detail = async (categoryId: number): Promise<CategoryType> => {
  const res = await clientApi.get(`/filters/${categoryId}`);
  return res.data.data;
};

export { getAll, create, remove, update, detail, getList };
