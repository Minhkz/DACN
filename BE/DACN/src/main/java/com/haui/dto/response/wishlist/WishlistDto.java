package com.haui.dto.response.wishlist;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class WishlistDto {
    private Integer id;
    private Integer userId;
    private String username;
    private Integer totalItems;
    private LocalDateTime createdDate;
    private List<WishlistItemDto> items;
}
