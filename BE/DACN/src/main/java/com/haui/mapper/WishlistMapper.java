package com.haui.mapper;

import com.haui.dto.response.wishlist.WishlistDto;
import com.haui.entity.Wishlist;
import org.springframework.stereotype.Component;

@Component
public class WishlistMapper {

    public WishlistDto toDto(Wishlist wishlist) {
        if (wishlist == null) {
            return null;
        }

        WishlistDto dto = new WishlistDto();
        dto.setId(wishlist.getId());
        if (wishlist.getUser() != null) {
            dto.setUserId(wishlist.getUser().getId());
            dto.setUsername(wishlist.getUser().getUsername());
        }
        dto.setCreatedDate(wishlist.getCreatedDate());
        return dto;
    }
}
