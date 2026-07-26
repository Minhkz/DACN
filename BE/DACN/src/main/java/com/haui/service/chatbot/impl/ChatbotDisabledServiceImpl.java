package com.haui.service.chatbot.impl;

import com.haui.dto.request.chatbot.ChatRequest;
import com.haui.dto.response.chatbot.ChatResponse;
import com.haui.service.chatbot.ChatbotService;

import java.util.List;

public class ChatbotDisabledServiceImpl implements ChatbotService {
    @Override
    public ChatResponse ask(Integer userId, ChatRequest request) {

        return ChatResponse.builder()
                .answer("Chatbot AI hiện đang tạm thời không khả dụng.")
                .products(List.of())
                .build();
    }
}
