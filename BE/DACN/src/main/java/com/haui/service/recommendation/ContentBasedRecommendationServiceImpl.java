package com.haui.service.recommendation;

import com.haui.entity.Filter;
import com.haui.entity.ProductFilter;
import com.haui.entity.ProductVector;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.repository.FilterRepository;
import com.haui.repository.ProductFilterRepository;
import com.haui.repository.ProductRepository;
import com.haui.repository.ProductVectorRepository;
import com.haui.utils.VectorUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ContentBasedRecommendationServiceImpl implements ContentBasedRecommendationService {
    ProductRepository productRepository;
    ProductVectorRepository productVectorRepository;
    ProductFilterRepository productFilterRepository;
    FilterRepository filterRepository;


    @Override
    public Map<Integer, Double> recommendSimilar(Integer productId, int topN) {
        ProductVector current = productVectorRepository.findByProductId(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VECTOR_NOT_FOUND));
        List<Double> currentVector = VectorUtil.parseJsonArray(current.getEmbeddingJson());

        Filter category = filterRepository.findCategoryByProductId(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_CATEGORY_NOT_FOUND));

        List<Integer> candidateIds = productFilterRepository
                .findProductIdsByFilterIdAndProductIdNot(category.getId(), productId);

        if (candidateIds.isEmpty()) {
            return Map.of();
        }

        List<ProductVector> candidates = productVectorRepository.findByProductIdIn(candidateIds);

        Map<Integer, Double> scored = new LinkedHashMap<>();
        for (ProductVector pv : candidates) {
            double sim = VectorUtil.cosineSimilarity(
                    currentVector, VectorUtil.parseJsonArray(pv.getEmbeddingJson()));
            if (sim > 0) {
                scored.put(pv.getProduct().getId(), sim);
            }
        }

        return scored.entrySet().stream()
                .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                .limit(topN)
                .collect(LinkedHashMap::new, (m, e) -> m.put(e.getKey(), e.getValue()), Map::putAll);
    }
}
