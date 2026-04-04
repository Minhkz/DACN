package com.haui.dto.request.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class OrderUpdateRequest {
    @NotBlank(message = "shippingAddress is required")
    private String shippingAddress;

    @NotBlank(message = "paymentMethod is required")
    private String paymentMethod;

    private Integer status;

    @Valid
    @NotEmpty(message = "items must not be empty")
    private List<OrderItemRequest> items;
}
