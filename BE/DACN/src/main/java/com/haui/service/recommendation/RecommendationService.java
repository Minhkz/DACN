package com.haui.service.recommendation;

import com.haui.dto.response.recommendation.RecommendationDto;
import org.springframework.stereotype.Service;


public interface RecommendationService {
    RecommendationDto recommend(Integer productId, int topN);
}
