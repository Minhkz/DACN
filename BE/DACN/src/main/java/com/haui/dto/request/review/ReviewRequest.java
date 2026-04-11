package com.haui.dto.request.review;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReviewRequest {

    // ===== ID (dùng cho update) =====
    private Integer id;

    // ===== CONTENT =====
    @NotBlank(message = "Review content must not be empty")
    @Size(min = 2, max = 500, message = "Review must be between 2 and 500 characters")
    private String reviewContent;

    // ===== RATING =====
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must not exceed 5")
    private Integer rating;

    // ===== PRODUCT =====
    @NotNull(message = "ProductId không được để trống")
    @Positive(message = "ProductId phải là số dương")
    private Integer productId;

    // ===== USER =====
    @NotNull(message = "UserId không được để trống")
    @Positive(message = "UserId phải là số dương")
    private Integer userId;
}