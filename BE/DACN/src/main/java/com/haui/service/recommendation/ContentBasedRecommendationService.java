package com.haui.service.recommendation;

import java.util.Map;

public interface ContentBasedRecommendationService {
    Map<Integer, Double> recommendSimilar(Integer productId, int topN);
}
