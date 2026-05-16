package com.haui.dto.request.order.client;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderDetailRequest {
    @NotNull(message = "Mã đơn hàng không được để trống")
    private Integer orderId;
}
