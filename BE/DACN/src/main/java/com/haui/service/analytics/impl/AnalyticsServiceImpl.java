package com.haui.service.analytics.impl;

import com.haui.dto.response.analytics.*;
import com.haui.entity.ProductCart;
import com.haui.enums.CartEventType;
import com.haui.repository.CartEventRepository;
import com.haui.repository.ProductCartRepository;
import com.haui.repository.ProductViewRepository;
import com.haui.service.analytics.AnalyticsService;
import com.haui.service.cloudinary.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ProductViewRepository productViewRepository;
    private final CartEventRepository cartEventRepository;
    private final ProductCartRepository productCartRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional(readOnly = true)
    public List<ProductViewStatsDto> getTopProductViews(int limit) {
        Map<String, String> imageUrlCache = new HashMap<>();

        return productViewRepository.findTopProductViews(PageRequest.of(0, limit))
                .stream()
                .peek(item -> item.setProductAvatar(
                        convertWithCache(item.getProductAvatar(), imageUrlCache)
                ))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CartAdditionStatsDto> getTopAddToCartProducts(int limit) {
        Map<String, String> imageUrlCache = new HashMap<>();

        return cartEventRepository.findTopAddToCartProducts(
                        CartEventType.ADD_TO_CART,
                        PageRequest.of(0, limit)
                )
                .stream()
                .peek(item -> item.setProductAvatar(
                        convertWithCache(item.getProductAvatar(), imageUrlCache)
                ))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AbandonedCartDto> getAbandonedCarts(int hours) {
        LocalDateTime threshold = LocalDateTime.now().minusHours(hours);

        List<AbandonedCartRawDto> rawCarts =
                cartEventRepository.findAbandonedCartRaw(threshold);

        if (rawCarts.isEmpty()) {
            return List.of();
        }

        List<Integer> cartIds = rawCarts.stream()
                .map(AbandonedCartRawDto::getCartId)
                .toList();

        List<ProductCart> allProductCarts =
                productCartRepository.findByCartIdsWithProduct(cartIds);

        Map<Integer, List<ProductCart>> productCartMap =
                allProductCarts.stream()
                        .collect(Collectors.groupingBy(item -> item.getCart().getId()));

        Map<String, String> imageUrlCache = new HashMap<>();

        return rawCarts.stream()
                .map(raw -> toAbandonedCartDto(
                        raw,
                        productCartMap.getOrDefault(raw.getCartId(), List.of()),
                        imageUrlCache
                ))
                .toList();
    }

    private AbandonedCartDto toAbandonedCartDto(
            AbandonedCartRawDto raw,
            List<ProductCart> productCarts,
            Map<String, String> imageUrlCache
    ) {
        List<AbandonedCartItemDto> items = productCarts.stream()
                .map(item -> toAbandonedCartItemDto(item, imageUrlCache))
                .toList();

        BigDecimal totalAmount = items.stream()
                .map(AbandonedCartItemDto::getSubTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AbandonedCartDto.builder()
                .cartId(raw.getCartId())
                .userId(raw.getUserId())
                .username(raw.getUsername())
                .fullName(raw.getFullName())
                .email(raw.getEmail())
                .lastCartActivity(raw.getLastCartActivity())
                .totalAmount(totalAmount)
                .items(items)
                .build();
    }

    private AbandonedCartItemDto toAbandonedCartItemDto(
            ProductCart item,
            Map<String, String> imageUrlCache
    ) {
        BigDecimal price = resolvePrice(item);

        BigDecimal subTotal = price.multiply(
                BigDecimal.valueOf(item.getQuantity())
        );

        String avatar = item.getProduct().getAvatar();

        return AbandonedCartItemDto.builder()
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productAvatar(convertWithCache(avatar, imageUrlCache))
                .quantity(item.getQuantity())
                .price(price)
                .subTotal(subTotal)
                .build();
    }

    private BigDecimal resolvePrice(ProductCart item) {
        if (item.getPrice() != null) {
            return item.getPrice();
        }

        if (item.getProduct() != null && item.getProduct().getPrice() != null) {
            return item.getProduct().getPrice();
        }

        return BigDecimal.ZERO;
    }

    private String convertWithCache(String avatar, Map<String, String> cache) {
        if (avatar == null || avatar.isBlank()) {
            return null;
        }

        return cache.computeIfAbsent(avatar, cloudinaryService::getImageUrl);
    }
}