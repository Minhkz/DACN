package com.haui.dto.response.wishlist.product;

import lombok.Data;

import java.util.List;

@Data
public class WishlistProductDto {
    private Integer id;
    private Integer userId;
    private List<WishlistItemDto> items;
}
