package com.haui.event;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatbotMessageEvent {
    private Integer userId;
    private String question;
    private String answer;
    private LocalDateTime createdAt;
}