package com.haui.service;

import com.haui.dto.response.wishlist.WishlistDto;
import com.haui.dto.response.wishlist.product.WishlistProductDto;
import com.haui.dto.response.wishlist.product.WishlistItemDto;

import java.util.List;

public interface WishlistService {
    WishlistDto getByUserId(Integer userId);

    List<WishlistItemDto> getProducts(Integer userId);

    void addProduct(Integer userId, Integer productId);

    void removeProduct(Integer userId, Integer productId);

    WishlistDto create(Integer userId);
}
