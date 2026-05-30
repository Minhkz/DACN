package com.haui.consumer;

import com.haui.entity.Cart;
import com.haui.entity.CartEvent;
import com.haui.entity.Product;
import com.haui.entity.User;
import com.haui.enums.CartEventType;
import com.haui.event.CartEventMessage;
import com.haui.repository.CartEventRepository;
import com.haui.repository.CartRepository;
import com.haui.repository.ProductRepository;
import com.haui.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class CartEventConsumer {

    private final CartEventRepository cartEventRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    @KafkaListener(
            topics = "${app.kafka.topics.cart-event}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "cartEventKafkaListenerContainerFactory"
    )
    @Transactional
    public void consume(CartEventMessage event) {
        Product product = productRepository.findById(event.getProductId())
                .orElse(null);

        if (product == null) {
            return;
        }

        User user = null;
        Cart cart = null;

        if (event.getUserId() != null) {
            user = userRepository.findById(event.getUserId()).orElse(null);
        }

        if (event.getCartId() != null) {
            cart = cartRepository.findById(event.getCartId()).orElse(null);
        }

        CartEvent cartEvent = CartEvent.builder()
                .user(user)
                .cart(cart)
                .product(product)
                .quantity(event.getQuantity())
                .actionType(CartEventType.valueOf(event.getActionType()))
                .createdAt(event.getCreatedAt())
                .build();

        cartEventRepository.save(cartEvent);
    }
}