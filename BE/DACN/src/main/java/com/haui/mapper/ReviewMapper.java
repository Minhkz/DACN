package com.haui.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.haui.dto.request.review.ReviewRequest;
import com.haui.dto.request.user.UserRequest;
import com.haui.dto.response.review.ReviewDto;
import com.haui.dto.response.user.UserDto;
import com.haui.entity.Review;

@Mapper(componentModel = "spring")
public abstract class ReviewMapper implements EntityMapper<ReviewDto, Review> {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "content", source = "reviewContent")
    public abstract Review toCreate(ReviewRequest request);

    @Mapping(target = "reviewContent", source = "content")
    public abstract ReviewDto toDto(Review review);
}
