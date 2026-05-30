package com.haui.event;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductIndexEvent {
    private Integer productId;
    private String action;
    private LocalDateTime createdAt;
}