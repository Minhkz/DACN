package com.haui.consumer;

import com.haui.entity.ChatMessage;
import com.haui.entity.User;
import com.haui.event.ChatbotMessageEvent;
import com.haui.repository.ChatMessageRepository;
import com.haui.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class ChatbotLogConsumer {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    @KafkaListener(
            topics = "${app.kafka.topics.chatbot-message}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "chatbotMessageKafkaListenerContainerFactory"
    )
    @Transactional
    public void consume(ChatbotMessageEvent event) {
        User user = null;

        if (event.getUserId() != null) {
            user = userRepository.findById(event.getUserId()).orElse(null);
        }

        ChatMessage chatMessage = ChatMessage.builder()
                .user(user)
                .question(event.getQuestion())
                .answer(event.getAnswer())
                .createdAt(event.getCreatedAt())
                .build();

        chatMessageRepository.save(chatMessage);
    }
}