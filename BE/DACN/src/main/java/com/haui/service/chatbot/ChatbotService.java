package com.haui.service.chatbot;

import com.haui.dto.request.chatbot.ChatRequest;
import com.haui.dto.response.chatbot.ChatResponse;

public interface ChatbotService {
    ChatResponse ask(Integer userId, ChatRequest request);
}
