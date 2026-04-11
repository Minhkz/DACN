package com.haui.service;

import com.haui.dto.request.wishlist.WishlistRequest;
import com.haui.dto.response.wishlist.WishlistDto;

import java.util.List;

public interface WishlistService {

    boolean toggle(WishlistRequest request);

    boolean isLiked(Integer userId, Integer productId);

    List<WishlistDto> getByUser(Integer userId);
}