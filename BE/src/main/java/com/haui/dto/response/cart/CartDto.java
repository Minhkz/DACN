package com.haui.dto.response.cart;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CartDto {
    private Integer id;
    private Integer userId;
    private String username;
    private BigDecimal totalPrice;
    private List<CartItemDto> items;
}
