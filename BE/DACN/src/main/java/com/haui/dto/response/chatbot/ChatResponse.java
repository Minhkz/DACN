package com.haui.dto.response.chatbot;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ChatResponse {
    private String answer;
    private List<ChatProductDto> products;
}
