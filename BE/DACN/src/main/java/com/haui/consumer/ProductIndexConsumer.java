package com.haui.consumer;

import com.haui.event.ProductIndexEvent;
import com.haui.service.ai.ProductEmbeddingService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductIndexConsumer {

    private final ProductEmbeddingService productEmbeddingService;

    @KafkaListener(
            topics = "${app.kafka.topics.product-index}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "productIndexKafkaListenerContainerFactory"
    )
    public void consume(ProductIndexEvent event) {
        if ("DELETE".equalsIgnoreCase(event.getAction())) {
            productEmbeddingService.deleteProductVector(event.getProductId());
            return;
        }

        productEmbeddingService.indexProduct(event.getProductId());
    }
}