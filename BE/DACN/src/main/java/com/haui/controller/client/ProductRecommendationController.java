package com.haui.controller.client;

import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.recommendation.RecommendationDto;
import com.haui.service.recommendation.RecommendationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class ProductRecommendationController {
    RecommendationService recommendationService;

    @GetMapping("/{productId}/recommendations")
    public ResponseResult<RecommendationDto> getRecommendations(
            @PathVariable Integer productId,
            @RequestParam(defaultValue = "4") int limit) {
        return ResponseResult.success(recommendationService.recommend(productId, limit));
    }

}
