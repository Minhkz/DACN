import { ResponseResult } from '@/types/common/ResponseResult';
import UserDetailType from '@/types/user/UserDetailType';
import UserDto from '@/types/user/UserDto';
import UserUpdateRequest from '@/types/user/UserUpdateRequest';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/users';

const getAll = async (): Promise<UserDetailType[]> => {
  const res = await axios.get(BASE_URL);
  return res.data.data;
};

const create = async (request: UserRequest): Promise<UserDto> => {
  const formData = new FormData();

  formData.append('username', request.username);
  formData.append('password', request.password);
  formData.append('email', request.email);
  formData.append('phone', request.phone);
  formData.append('address', request.address);
  formData.append('fullName', request.fullName);
  formData.append('roleId', String(request.roleId));

  if (request.avatar) {
    formData.append('avatar', request.avatar);
  }

  const response = await axios.post<ResponseResult<UserDto>>(
    BASE_URL,
    formData
  );
  return response.data.data;
};

const remove = async (userId: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${userId}`);
};

const detail = async (userId: number): Promise<UserDetailType> => {
  const res = await axios.get(`${BASE_URL}/${userId}`);
  return res.data.data;
};

const update = async (
  userId: number,
  request: UserUpdateRequest
): Promise<UserDto> => {
  const formData = new FormData();

  formData.append('id', String(request.id));
  formData.append('username', request.username);
  formData.append('email', request.email);
  formData.append('phone', request.phone);
  formData.append('address', request.address);
  formData.append('fullName', request.fullName);

  if (request.avatar) {
    formData.append('avatar', request.avatar);
  }

  const response = await axios.put<ResponseResult<UserDto>>(
    `${BASE_URL}/${userId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
};
export { getAll, create, remove, detail, update };
