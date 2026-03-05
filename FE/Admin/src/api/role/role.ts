import { RoleCreate } from '@/types/role/create/RoleCreate';
import { RoleResponse } from '@/types/role/RoleResponse';
import type { RoleType } from '@/types/role/RoleTpye';
import axios from 'axios';
const BASE_URL = 'http://localhost:8080/api';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getAll = async (): Promise<RoleType[]> => {
  await delay(2000);
  const res = await axios.get(BASE_URL + '/roles');
  return res.data.data;
};

const create = async (data: RoleCreate): Promise<RoleType> => {
  await delay(2000);
  const res = await axios.post<RoleResponse<RoleType>>(
    BASE_URL + '/roles',
    data
  );
  return res.data.data;
};

const detail = async (id: number): Promise<RoleType> => {
  await delay(2000);
  const res = await axios.get<RoleResponse<RoleType>>(
    BASE_URL + `/roles/${id}`
  );
  return res.data.data;
};

const update = async (id: number, data: RoleType): Promise<RoleType> => {
  await delay(2000);
  const res = await axios.put<RoleResponse<RoleType>>(
    BASE_URL + `/roles/${id}`,
    data
  );
  return res.data.data;
};

const remove = async (id: number): Promise<void> => {
  await delay(2000);
  await axios.delete(BASE_URL + `/roles/${id}`);
};

export { getAll, create, detail, update, remove };
