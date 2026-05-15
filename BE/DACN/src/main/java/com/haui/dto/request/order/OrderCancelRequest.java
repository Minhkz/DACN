package com.haui.dto.request.order;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class OrderCancelRequest {
    @NotEmpty(message = "Mã đơn hàng không được để trống")
    private Integer orderId;
}
