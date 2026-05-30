package com.haui.event;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartEventMessage {
    private Integer userId;
    private Integer cartId;
    private Integer productId;
    private Integer quantity;
    private String actionType;
    private LocalDateTime createdAt;
}