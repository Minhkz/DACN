import { UserType } from '@/types/user/UserType';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/user';

const getAll = async (): Promise<UserType[]> => {
  const res = await axios.get(BASE_URL);
  return res.data.data;
};

export { getAll };
