package com.haui.dto.response.order.admin;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderAdminItemDto {
    private Integer id;
    private Integer productId;
    private String productName;
    private String productAvatar;
    private BigDecimal price;
    private Integer quantity;
}
