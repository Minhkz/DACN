import { clientApi } from '@/lib/axios/client';
import { PaginationResponse } from '@/types/common/PaginationResponse';

import { ResponseResult } from '@/types/common/ResponseResult';
import UserDetailType from '@/types/user/UserDetailType';
import UserDto from '@/types/user/UserDto';
import UserUpdateRequest from '@/types/user/UserUpdateRequest';
import axios from 'axios';

const getAll = async (
  page: number,
  size: number
): Promise<PaginationResponse<UserDetailType[]>> => {
  const res = await clientApi.get('/users', {
    params: {
      page,
      size,
      sort: 'id.desc',
    },
  });

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

  const response = await clientApi.post<ResponseResult<UserDto>>(
    '/users',
    formData
  );
  return response.data.data;
};

const remove = async (userId: number): Promise<void> => {
  await clientApi.delete(`/users/${userId}`);
};

const detail = async (userId: number): Promise<UserDetailType> => {
  const res = await clientApi.get(`/users/${userId}`);
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

  const response = await clientApi.put<ResponseResult<UserDto>>(
    `/users/${userId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
};

const me = async (): Promise<UserDetailType> => {
  const res = await clientApi.get('/profile/me');
  return res.data.data;
};
export { getAll, create, remove, detail, update, me };
