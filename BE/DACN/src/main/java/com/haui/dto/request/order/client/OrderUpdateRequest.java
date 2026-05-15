package com.haui.dto.request.order.client;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderUpdateRequest {
    @NotBlank(message = "shippingAddress is required")
    private String shippingAddress;
}
