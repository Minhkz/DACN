package com.haui.controller.client;

import java.util.List;

import com.haui.dto.request.review.ReviewRequest;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.review.ProductReviewSummary;
import com.haui.dto.response.review.ReviewDto;
import com.haui.service.ReviewService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ReviewController {

    ReviewService reviewService;

    @PostMapping("/api/v1/products/{productId}/reviews")
    public ResponseResult<ReviewDto> create(
            @PathVariable Integer productId,
            @RequestBody ReviewRequest request
    ) {
        request.setProductId(productId);
        return ResponseResult.success(reviewService.create(request));
    }

    @GetMapping("/api/v1/products/{productId}/reviews")
    public ResponseResult<List<ReviewDto>> getByProduct(@PathVariable Integer productId) {
        return ResponseResult.success(reviewService.getByProduct(productId));
    }

    @GetMapping("/api/v1/products/{productId}/reviews/summary")
    public ResponseResult<ProductReviewSummary> getReviewSummary(@PathVariable Integer productId) {
        return ResponseResult.success(reviewService.getReviewSummary(productId));
    }

    @PutMapping("/api/v1/reviews/{id}")
    public ResponseResult<ReviewDto> update(
            @PathVariable Integer id,
            @RequestBody ReviewRequest request
    ) {
        request.setId(id);
        return ResponseResult.success(reviewService.update(request));
    }

    @DeleteMapping("/api/v1/reviews/{id}")
    public ResponseResult<String> delete(@PathVariable Integer id) {
        reviewService.delete(id);
        return ResponseResult.success("Delete successfully");
    }


}