package com.haui.dto.response.order.admin;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderAdminDto {
    private Integer id;

    private Integer userId;
    private String username;
    private String fullName;
    private String email;

    private String status;
    private String paymentMethod;
    private String paymentStatus;

    private String shippingAddress;
    private String phone;

    private LocalDateTime createdDate;

    private List<OrderAdminItemDto> products;
}
