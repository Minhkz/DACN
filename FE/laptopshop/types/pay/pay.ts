export interface CreatePaymentPayload {
  amount: number;
  orderInfo: string;
  orderId: number;
}

export interface CreatePaymentData {
  paymentUrl: string;
}
