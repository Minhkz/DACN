package com.haui.service.impl;

import com.haui.dto.request.wishlist.WishlistRequest;
import com.haui.dto.response.wishlist.WishlistDto;
import com.haui.entity.Wishlist;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.mapper.WishlistMapper;
import com.haui.repository.ProductRepository;
import com.haui.repository.UserRepository;
import com.haui.repository.WishlistRepository;
import com.haui.service.WishlistService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WishlistMapper wishlistMapper;

    @Override
    public boolean toggle(WishlistRequest request) {

        if (request.getUserId() == null || request.getProductId() == null) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        var user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        var product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        var exist = wishlistRepository
                .findByUserIdAndProductId(user.getId(), product.getId());

        if (exist.isPresent()) {
            wishlistRepository.delete(exist.get());
            return false;
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);

        wishlistRepository.save(wishlist);

        return true;
    }

    @Override
    public boolean isLiked(Integer userId, Integer productId) {
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }

    @Override
    public List<WishlistDto> getByUser(Integer userId) {

        return wishlistRepository.findByUserId(userId)
                .stream()
                .map(wishlistMapper::toDto)
                .toList();
    }
}