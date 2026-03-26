package com.haui.service.impl;

import org.springframework.stereotype.Service;

import com.haui.dto.request.review.ReviewRequest;
import com.haui.dto.response.review.ReviewDto;
import com.haui.entity.Product;
import com.haui.entity.Review;
import com.haui.entity.User;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.mapper.ReviewMapper;
import com.haui.repository.ProductRepository;
import com.haui.repository.ReviewRepository;
import com.haui.repository.UserRepository;
import com.haui.service.ReviewService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    ReviewRepository reviewRepository;
    UserRepository userRepository;
    ProductRepository productRepository;
    ReviewMapper reviewMapper;

    private void validateLogic(ReviewRequest request, Boolean isCreated) {
        if (isCreated) {
            if (!productRepository.existsById(request.getProductId())) {
                throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
            }
            if (!userRepository.existsById(request.getUserId())) {
                throw new AppException(ErrorCode.USER_NOT_FOUND);
            }
        } else {

        }
    }

    @Override
    public ReviewDto create(ReviewRequest request) {
        validateLogic(request, true);
        Review entity = reviewMapper.toCreate(request);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        entity.setProduct(product);
        entity.setUser(user);
        reviewRepository.save(entity);
        return reviewMapper.toDto(entity);
    }

}
