package com.haui.dto.response.review;

import lombok.Data;

@Data
public class ProductReviewSummary {
    private Integer totalReviews;
    private Double averageRating;
}
