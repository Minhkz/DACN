package com.haui.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.haui.dto.request.review.ReviewRequest;
import com.haui.dto.response.review.ReviewDto;
import com.haui.entity.Review;

@Mapper(componentModel = "spring")
public abstract class ReviewMapper implements EntityMapper<ReviewDto, Review> {

    // ===== CREATE =====
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "content", ignore = true)
    public abstract Review toCreate(ReviewRequest request);

    // ===== DTO =====
    @Mapping(target = "reviewContent", source = "content")
    public abstract ReviewDto toDto(Review review);
}