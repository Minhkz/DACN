package com.haui.dto.response.analytics;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AbandonedCartRawDto {
    private Integer cartId;
    private Integer userId;
    private String username;
    private String fullName;
    private String email;
    private LocalDateTime lastCartActivity;
}
