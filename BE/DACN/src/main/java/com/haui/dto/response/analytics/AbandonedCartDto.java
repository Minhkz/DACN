package com.haui.dto.response.analytics;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AbandonedCartDto {
    private Integer cartId;
    private Integer userId;
    private String username;
    private String fullName;
    private String email;
    private LocalDateTime lastCartActivity;
    private BigDecimal totalAmount;
    private List<AbandonedCartItemDto> items;
}
