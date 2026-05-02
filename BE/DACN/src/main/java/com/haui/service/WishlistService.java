package com.haui.service;

import com.haui.dto.response.wishlist.WishlistDto;
import com.haui.dto.response.wishlist.product.WishlistProductDto;
import com.haui.dto.response.wishlist.product.WishlistItemDto;

import java.util.List;

public interface WishlistService {
    WishlistDto getByUserId(Integer userId);

    List<WishlistItemDto> getProducts(Integer id);

    void addProduct(Integer id, Integer productId);

    void removeProduct(Integer id, Integer productId);

    boolean check(Integer userId, Integer productId);

    WishlistDto create(Integer request);
}
