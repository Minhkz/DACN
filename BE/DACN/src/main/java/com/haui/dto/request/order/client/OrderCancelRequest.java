package com.haui.dto.request.order.client;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderCancelRequest {
    @NotNull(message = "Mã đơn hàng không được để trống")
    private Integer orderId;
}
