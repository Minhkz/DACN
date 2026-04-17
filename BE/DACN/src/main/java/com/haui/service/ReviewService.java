package com.haui.service;

import java.util.List;

import com.haui.dto.request.review.ReviewRequest;
import com.haui.dto.response.review.ProductReviewSummary;
import com.haui.dto.response.review.ReviewDto;

public interface ReviewService {

    // 1. Thêm review
    ReviewDto create(ReviewRequest request);

    // 2. Sửa review
    ReviewDto update(ReviewRequest request);

    // 3. Xóa review
    void delete(Integer id);

    // 4. Đếm tổng review
    Integer count();

    // 5. Đếm review theo productId
    ProductReviewSummary getReviewSummary(Integer productId);
    
    // 6. Lấy danh sách review theo productId
    List<ReviewDto> getByProduct(Integer productId);
}