package com.haui.controller.admin;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.haui.dto.request.review.ReviewRequest;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.review.ReviewDto;
import com.haui.service.ReviewService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/v1/reviews")
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ReviewController {

    ReviewService reviewService;

    // ===== 1. CREATE =====
    @PostMapping
    public ResponseResult<ReviewDto> create(@RequestBody ReviewRequest request) {
        return ResponseResult.success(reviewService.create(request));
    }

    // ===== 2. UPDATE =====
    @PutMapping("/{id}")
    public ResponseResult<ReviewDto> update(
        @PathVariable Integer id,
        @RequestBody ReviewRequest request) {

        request.setId(id);

        return ResponseResult.success(reviewService.update(request));
    }

    // ===== 3. DELETE =====
    @DeleteMapping("/{id}")
    public ResponseResult<String> delete(@PathVariable Integer id) {
        reviewService.delete(id);
        return ResponseResult.success("Delete successfully");
    }

    // ===== 4. COUNT =====
    @GetMapping("/count/{productId}")
    public ResponseResult<Integer> countByProduct(@PathVariable Integer productId) {
        return ResponseResult.success(reviewService.countByProduct(productId));
    }

    // ===== 5. GET LIST BY PRODUCT =====
    @GetMapping("/product/{productId}")
    public ResponseResult<List<ReviewDto>> getByProduct(@PathVariable Integer productId) {
        return ResponseResult.success(reviewService.getByProduct(productId));
    }
}