package com.haui.event;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductViewEvent {
    private Integer userId;
    private Integer productId;
    private String sessionId;
    private String ipAddress;
    private LocalDateTime viewedAt;
}
