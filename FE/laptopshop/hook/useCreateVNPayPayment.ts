import { createVNPayPayment } from "@/services/pay/PayService";
import { CreatePaymentPayload } from "@/types/pay/pay";
import { notify } from "@/utils/notify";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useCreateVNPayPayment() {
  return useMutation({
    mutationFn: (payload: CreatePaymentPayload) => createVNPayPayment(payload),

    onError: (error: AxiosError<{ message?: string }>) => {
      notify(
        "error",
        error.response?.data?.message ?? "Tạo liên kết thanh toán thất bại",
      );
    },
  });
}
