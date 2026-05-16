import { clientApi } from "@/lib/axios/client";
import { PageResponse } from "@/types/common/PageResponse";
import { ResponseResult } from "@/types/common/ResponseResult";
import {
  CreateOrderRequest,
  OrderDto,
  OrderRequest,
} from "@/types/order/order";

const orderService = {
  create: async (payload: OrderRequest): Promise<OrderDto> => {
    const res = await clientApi.post("/orders", payload);
    return res.data.data;
  },
  getMyOrders: async (
    page: number,
    size: number,
  ): Promise<PageResponse<OrderDto>> => {
    const res = await clientApi.get<ResponseResult<PageResponse<OrderDto>>>(
      "/orders/me",
      {
        params: {
          page,
          size,
          sort: ["createdDate.desc"],
        },
      },
    );

    return res.data.data;
  },
  cancelOrder: async (orderId: number): Promise<void> => {
    await clientApi.delete(`/orders`, { data: { orderId } });
  },
  detail: async (orderId: number): Promise<OrderDto> => {
    const res = await clientApi.post<ResponseResult<OrderDto>>(
      "/orders/detail",
      {
        orderId,
      },
    );

    return res.data.data;
  },
};

export default orderService;
