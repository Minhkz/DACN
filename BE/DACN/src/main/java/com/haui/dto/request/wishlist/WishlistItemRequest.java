package com.haui.dto.request.wishlist;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WishlistItemRequest {
    @NotNull(message = "productId is required")
    private Integer productId;
}
