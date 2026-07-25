package com.haui.dto.response.recommendation;

import java.util.List;

public record RecommendationDto(
        List<Integer> similarProducts,
        List<Integer> frequentlyBoughtTogether
) {}
