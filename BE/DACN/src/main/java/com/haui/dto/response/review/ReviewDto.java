package com.haui.dto.response.review;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ReviewDto {

    private Integer id;

    private String reviewContent;

    private Integer rating;

    private LocalDateTime createdDate;
}