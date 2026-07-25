package com.haui.service.recommendation;

import com.haui.dto.response.recommendation.RecommendationDto;
import com.haui.entity.Product;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {
    ContentBasedRecommendationService contentBasedService;
    ItemBasedCFService cfService;
    ProductRepository productRepository;

    @Override
    public RecommendationDto recommend(Integer productId, int topN) {
        // Validate sản phẩm tồn tại trước khi tính toán
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Track 1: Content-Based — "Sản phẩm tương tự"
        List<Integer> similarProducts;
        try {
            similarProducts = contentBasedService.recommendSimilar(product.getId(), topN)
                    .keySet().stream().toList();
        } catch (AppException e) {
            similarProducts = List.of();
        }

        // Track 2: Item-based CF — "Thường được mua kèm"
        List<Integer> frequentlyBoughtTogether = cfService
                .recommendFrequentlyBoughtTogether(product.getId(), topN)
                .keySet().stream().toList();

        return new RecommendationDto(similarProducts, frequentlyBoughtTogether);
    }
}
