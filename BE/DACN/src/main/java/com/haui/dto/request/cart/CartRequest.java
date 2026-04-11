package com.haui.dto.request.cart;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartRequest {
    @NotNull(message = "userId is required")
    private Integer userId;
}
