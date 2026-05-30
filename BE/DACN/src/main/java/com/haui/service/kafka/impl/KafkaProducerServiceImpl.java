package com.haui.service.kafka.impl;

import com.haui.event.*;
import com.haui.service.kafka.KafkaProducerService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaProducerServiceImpl implements KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.kafka.topics.product-view}")
    private String productViewTopic;

    @Value("${app.kafka.topics.cart-event}")
    private String cartEventTopic;

    @Value("${app.kafka.topics.chatbot-message}")
    private String chatbotMessageTopic;

    @Value("${app.kafka.topics.product-index}")
    private String productIndexTopic;

    @Override
    public void sendProductViewEvent(ProductViewEvent event) {
        kafkaTemplate.send(productViewTopic, String.valueOf(event.getProductId()), event);
    }

    @Override
    public void sendCartEvent(CartEventMessage event) {
        kafkaTemplate.send(cartEventTopic, String.valueOf(event.getProductId()), event);
    }

    @Override
    public void sendChatbotMessageEvent(ChatbotMessageEvent event) {
        String key = event.getUserId() == null ? "anonymous" : String.valueOf(event.getUserId());
        kafkaTemplate.send(chatbotMessageTopic, key, event);
    }

    @Override
    public void sendProductIndexEvent(ProductIndexEvent event) {
        kafkaTemplate.send(productIndexTopic, String.valueOf(event.getProductId()), event);
    }
}