package com.haui.dto.response.analytics;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartAdditionStatsDto {
    private Integer productId;
    private String productName;
    private String productAvatar;
    private Long addToCartCount;
    private Long totalQuantity;
}
