package com.haui.dto.request.pay;

public record CreatePaymentRequest(long amount, String orderInfo, int orderId) {
}
