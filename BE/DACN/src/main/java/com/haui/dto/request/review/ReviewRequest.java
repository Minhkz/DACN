package com.haui.dto.request.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReviewRequest {

    // tích hợp api tccdd
    private Integer id;
    @NotBlank(message = "Review content must not be empty")
    @Size(min = 2, max = 500, message = "Review must be between 2 and 500 characters")
    private String reviewContent;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must not exceed 5")
    private Integer rating;

    @NotNull(message = "ProductId không được để trống")
    @Positive(message = "ProductId phải là số dương")
    private Integer productId;

    @NotNull(message = "UserId không được để trống")
    @Positive(message = "UserId phải là số dương")
    private Integer userId;

}
