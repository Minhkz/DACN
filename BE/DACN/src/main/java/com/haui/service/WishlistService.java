package com.haui.service;

import com.haui.dto.request.wishlist.WishlistItemRequest;
import com.haui.dto.request.wishlist.WishlistRequest;
import com.haui.dto.response.wishlist.WishlistDto;

import java.util.List;

public interface WishlistService {
    WishlistDto create(WishlistRequest request);
    List<WishlistDto> getAll();
    WishlistDto getById(Integer id);
    WishlistDto getByUserId(Integer userId);
    WishlistDto addItem(Integer wishlistId, WishlistItemRequest request);
    WishlistDto removeItem(Integer wishlistId, Integer itemId);
    void delete(Integer id);
}
