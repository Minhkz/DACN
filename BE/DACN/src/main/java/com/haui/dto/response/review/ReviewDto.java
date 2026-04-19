package com.haui.dto.response.review;

import java.time.LocalDateTime;

import com.haui.dto.response.user.UserDetailDto;
import com.haui.dto.response.user.UserReview;
import lombok.Data;

@Data
public class ReviewDto {

    private Integer id;

    private String reviewContent;

    private Integer rating;

    private UserReview user;

    private LocalDateTime createdDate;
}