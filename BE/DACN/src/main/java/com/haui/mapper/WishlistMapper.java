package com.haui.mapper;

import com.haui.dto.response.wishlist.WishlistDto;
import com.haui.entity.Wishlist;
import org.springframework.stereotype.Component;

@Component
public class WishlistMapper {

    public WishlistDto toDto(Wishlist w) {

        if (w == null) return null;

        WishlistDto dto = new WishlistDto();

        dto.setId(w.getId());
        dto.setProductId(w.getProduct().getId());
        dto.setProductName(w.getProduct().getName());
        dto.setPrice(w.getProduct().getPrice());

        return dto;
    }
}