import { clientApi } from "@/lib/axios/client";
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
};

export default orderService;
