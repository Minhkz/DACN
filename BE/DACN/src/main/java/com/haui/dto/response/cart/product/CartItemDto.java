package com.haui.dto.response.cart.product;

import com.haui.dto.response.product.ProductDetailDto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartItemDto {
    private Integer productId;

    private String productName;

    private String avatar;

    private BigDecimal price;
}
