package com.haui.service.impl;

import java.util.List;
//import org.hibernate.mapping.List;
import com.haui.dto.response.review.ProductReviewSummary;
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

    // ===== FILTER BAD WORD =====
    private String filterBadWords(String content) {
        String[] badWords = {"fuck", "shit"};

        for (String word : badWords) {
            content = content.replaceAll("(?i)" + word, "*".repeat(word.length()));
        }
        return content;
    }

    // ===== CREATE =====
    @Override
    public ReviewDto create(ReviewRequest request) {

        if (!productRepository.existsById(request.getProductId())) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        if (!userRepository.existsById(request.getUserId())) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        Review entity = reviewMapper.toCreate(request);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        entity.setProduct(product);
        entity.setUser(user);
        entity.setContent(filterBadWords(request.getReviewContent()));

        reviewRepository.save(entity);

        return reviewMapper.toDto(entity);
    }

    // ===== UPDATE =====
    @Override
    public ReviewDto update(ReviewRequest request) {

        if (request.getId() == null) {
            throw new AppException(ErrorCode.MISSING_FIELD);
        }

        Review entity = reviewRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        entity.setContent(filterBadWords(request.getReviewContent()));
        entity.setRating(request.getRating());

        reviewRepository.save(entity);

        return reviewMapper.toDto(entity);
    }

    // ===== DELETE =====
    @Override
    public void delete(Integer id) {

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        reviewRepository.delete(review);
    }

    // ===== COUNT ALL =====
    @Override
    public Integer count() {
        return (int) reviewRepository.count();
    }

    // ===== COUNT BY PRODUCT =====
    @Override
    public ProductReviewSummary getReviewSummary(Integer productId) {
        if (!productRepository.existsById(productId)) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        Integer totalReviews = reviewRepository.countByProductId(productId);
        Double averageRating = reviewRepository.getAverageRatingByProductId(productId);

        ProductReviewSummary summary = new ProductReviewSummary();
        summary.setTotalReviews(totalReviews);
        summary.setAverageRating(averageRating != null ? averageRating : 0.0);

        return summary;
    }
    
    // ===== GET LIST BY PRODUCT =====
    @Override
    public List<ReviewDto> getByProduct(Integer productId) {

        if (!productRepository.existsById(productId)) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        return reviewRepository.findByProductId(productId)
                .stream()
                .map(reviewMapper::toDto)
                .toList();
    }
}