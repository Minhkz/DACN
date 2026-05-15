import { update, remove } from '@/services/user/UserApi';
import { clientApi } from '@/lib/axios/client';
import { PaginationResponse } from '@/types/common/PaginationResponse';
import { ResponseResult } from '@/types/common/ResponseResult';
import { OrderAdminDto, OrderStatusUpdateRequest } from '@/types/order/order';

const getAllOrders = async (
  page: number,
  pageSize: number
): Promise<PaginationResponse<OrderAdminDto>> => {
  const res = await clientApi.get<
    ResponseResult<PaginationResponse<OrderAdminDto>>
  >(`/orders?page=${page}&size=${pageSize}`);

  return res.data.data;
};

const detail = async (orderId: number): Promise<OrderAdminDto> => {
  const res = await clientApi.get<ResponseResult<OrderAdminDto>>(
    `/orders/${orderId}`
  );
  return res.data.data;
};

const updateStatus = async (orderId: number, status: string) => {
  const res = await clientApi.patch<ResponseResult<null>>(
    `/orders/${orderId}`,
    { status }
  );
  return res.data;
};

const removeOrder = async (orderId: number) => {
  const res = await clientApi.delete<ResponseResult<null>>(
    `/orders/${orderId}`
  );
  return res.data;
};
export { getAllOrders, detail, updateStatus, removeOrder };
