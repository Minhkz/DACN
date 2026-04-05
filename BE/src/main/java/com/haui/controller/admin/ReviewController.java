package com.haui.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.haui.dto.request.review.ReviewRequest;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.review.ReviewDto;
import com.haui.service.ReviewService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/reviews")
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ReviewController {
    ReviewService reviewService;

    @PostMapping
    public ResponseResult<ReviewDto> create(@RequestBody ReviewRequest request) {
        return ResponseResult.success(reviewService.create(request));
    }

}
