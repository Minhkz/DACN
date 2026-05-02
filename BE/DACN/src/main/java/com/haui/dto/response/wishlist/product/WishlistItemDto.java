package com.haui.dto.response.wishlist.product;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class WishlistItemDto {
    private Integer productId;

    private String productName;

    private String avatar;

    private BigDecimal price;
}
