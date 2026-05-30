package com.haui.controller.client;

import com.haui.dto.request.chatbot.ChatRequest;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.chatbot.ChatResponse;
import com.haui.middleware.annotation.CurrentUserId;
import com.haui.service.chatbot.ChatbotService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chatbot")
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
@RequiredArgsConstructor
public class ChatbotController {
    ChatbotService chatbotService;

    @PostMapping("/ask")
    public ResponseResult<ChatResponse> ask(
            @CurrentUserId(required = false) Integer userId,
            @RequestBody @Valid ChatRequest request
    ) {
        return ResponseResult.success(chatbotService.ask(userId, request));
    }
}
