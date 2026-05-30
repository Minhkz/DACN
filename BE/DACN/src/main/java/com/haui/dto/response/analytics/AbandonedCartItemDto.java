package com.haui.dto.response.analytics;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AbandonedCartItemDto {
    private Integer productId;
    private String productName;
    private String productAvatar;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subTotal;
}
