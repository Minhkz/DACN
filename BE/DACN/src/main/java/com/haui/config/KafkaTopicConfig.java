package com.haui.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaTopicConfig {

    @Value("${app.kafka.topics.product-view}")
    private String productViewTopic;

    @Value("${app.kafka.topics.cart-event}")
    private String cartEventTopic;

    @Value("${app.kafka.topics.product-index}")
    private String productIndexTopic;

    @Value("${app.kafka.topics.chatbot-message}")
    private String chatbotMessageTopic;

    @Bean
    public NewTopic productViewTopic() {
        return new NewTopic(productViewTopic, 3, (short) 1);
    }

    @Bean
    public NewTopic cartEventTopic() {
        return new NewTopic(cartEventTopic, 3, (short) 1);
    }

    @Bean
    public NewTopic productIndexTopic() {
        return new NewTopic(productIndexTopic, 3, (short) 1);
    }

    @Bean
    public NewTopic chatbotMessageTopic() {
        return new NewTopic(chatbotMessageTopic, 3, (short) 1);
    }
}