package com.haui.dto.response.cart;

import com.haui.dto.response.cart.product.CartItemDto;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CartDto {
    private Integer id;
    private Integer userId;
}
