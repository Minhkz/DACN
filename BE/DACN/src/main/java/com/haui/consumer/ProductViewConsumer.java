package com.haui.consumer;

import com.haui.entity.Product;
import com.haui.entity.ProductView;
import com.haui.entity.User;
import com.haui.event.ProductViewEvent;
import com.haui.repository.ProductRepository;
import com.haui.repository.ProductViewRepository;
import com.haui.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class ProductViewConsumer {

    private final ProductViewRepository productViewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @KafkaListener(
            topics = "${app.kafka.topics.product-view}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "productViewKafkaListenerContainerFactory"
    )
    @Transactional
    public void consume(ProductViewEvent event) {
        Product product = productRepository.findById(event.getProductId())
                .orElse(null);

        if (product == null) {
            return;
        }

        User user = null;

        if (event.getUserId() != null) {
            user = userRepository.findById(event.getUserId()).orElse(null);
        }

        ProductView productView = ProductView.builder()
                .user(user)
                .product(product)
                .sessionId(event.getSessionId())
                .ipAddress(event.getIpAddress())
                .viewedAt(event.getViewedAt())
                .build();

        productViewRepository.save(productView);
    }
}