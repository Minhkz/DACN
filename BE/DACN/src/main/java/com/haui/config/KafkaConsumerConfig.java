package com.haui.config;

import com.haui.event.CartEventMessage;
import com.haui.event.ChatbotMessageEvent;
import com.haui.event.ProductIndexEvent;
import com.haui.event.ProductViewEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.*;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.group-id}")
    private String groupId;

    private Map<String, Object> baseProps() {
        Map<String, Object> props = new HashMap<>();

        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        return props;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ProductViewEvent>
    productViewKafkaListenerContainerFactory() {
        return createFactory(ProductViewEvent.class);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, CartEventMessage>
    cartEventKafkaListenerContainerFactory() {
        return createFactory(CartEventMessage.class);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ProductIndexEvent>
    productIndexKafkaListenerContainerFactory() {
        return createFactory(ProductIndexEvent.class);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ChatbotMessageEvent>
    chatbotMessageKafkaListenerContainerFactory() {
        return createFactory(ChatbotMessageEvent.class);
    }

    private <T> ConcurrentKafkaListenerContainerFactory<String, T> createFactory(
            Class<T> targetType
    ) {
        JsonDeserializer<T> jsonDeserializer = new JsonDeserializer<>(targetType);

        jsonDeserializer.addTrustedPackages("com.haui.event");
        jsonDeserializer.setUseTypeHeaders(true);
        jsonDeserializer.setRemoveTypeHeaders(false);

        ConsumerFactory<String, T> consumerFactory =
                new DefaultKafkaConsumerFactory<>(
                        baseProps(),
                        new StringDeserializer(),
                        jsonDeserializer
                );

        ConcurrentKafkaListenerContainerFactory<String, T> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(consumerFactory);

        return factory;
    }
}