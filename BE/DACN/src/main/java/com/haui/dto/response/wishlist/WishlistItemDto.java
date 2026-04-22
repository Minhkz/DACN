package com.haui.dto.response.wishlist;

import com.haui.dto.response.product.ProductDetailDto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class WishlistItemDto {
    private Integer id;
    private Integer productId;
    private String productName;
    private String productAvatar;
    private BigDecimal price;
    private ProductDetailDto product;
}
