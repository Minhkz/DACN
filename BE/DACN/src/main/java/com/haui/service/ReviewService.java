package com.haui.service;

import com.haui.dto.request.review.ReviewRequest;
import com.haui.dto.response.review.ReviewDto;

public interface ReviewService {

    ReviewDto create(ReviewRequest request);

}
