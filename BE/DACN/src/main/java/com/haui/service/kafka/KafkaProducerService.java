package com.haui.service.kafka;

import com.haui.event.CartEventMessage;
import com.haui.event.ChatbotMessageEvent;
import com.haui.event.ProductIndexEvent;
import com.haui.event.ProductViewEvent;

public interface KafkaProducerService {
    void sendProductViewEvent(ProductViewEvent event);

    void sendCartEvent(CartEventMessage event);

    void sendChatbotMessageEvent(ChatbotMessageEvent event);

    void sendProductIndexEvent(ProductIndexEvent event);
}
