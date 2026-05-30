package com.haui.dto.response.analytics;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductViewStatsDto {
    private Integer productId;
    private String productName;
    private String productAvatar;
    private Long viewCount;
}
