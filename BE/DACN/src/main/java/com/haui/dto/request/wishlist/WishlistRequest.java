package com.haui.dto.request.wishlist;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WishlistRequest {
    @NotNull(message = "userId is required")
    private Integer userId;
}
