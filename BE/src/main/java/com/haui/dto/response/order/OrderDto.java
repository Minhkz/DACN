package com.haui.dto.response.order;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDto {
    private Integer id;
    private Integer userId;
    private String username;
    private Integer status;
    private BigDecimal totalPrice;
    private String shippingAddress;
    private String paymentMethod;
    private LocalDateTime createdDate;
    private List<OrderItemDto> items;
}
