package com.haui.dto.request.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartItemRequest {
    @NotNull(message = "productId is required")
    private Integer productId;

    @NotNull(message = "quantity is required")
    @Min(value = 1, message = "quantity must be greater than 0")
    private Integer quantity;
}
