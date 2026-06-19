import { clientApi } from "@/lib/axios/client";
import { ResponseResult } from "@/types/chatbot/ChatbotType";
import { CreatePaymentPayload, CreatePaymentData } from "@/types/pay/pay";

export const createVNPayPayment = async (payload: CreatePaymentPayload) => {
  const { data } = await clientApi.post<ResponseResult<CreatePaymentData>>(
    "/payment/vnpay/create",
    payload,
  );
  return data.data;
};
