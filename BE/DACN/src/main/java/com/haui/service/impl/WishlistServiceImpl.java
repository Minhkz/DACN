package com.haui.service.impl;

import com.haui.dto.response.wishlist.WishlistDto;
import com.haui.dto.response.wishlist.product.WishlistProductDto;
import com.haui.dto.response.wishlist.product.WishlistItemDto;
import com.haui.entity.Product;
import com.haui.entity.ProductWishlist;
import com.haui.entity.User;
import com.haui.entity.Wishlist;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.mapper.WishlistMapper;
import com.haui.mapper.WishlistProductMapper;
import com.haui.repository.ProductRepository;
import com.haui.repository.ProductWishlistRepository;
import com.haui.repository.UserRepository;
import com.haui.repository.WishlistRepository;
import com.haui.service.WishlistService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WishlistServiceImpl implements WishlistService {

    WishlistRepository wishlistRepository;
    ProductWishlistRepository productWishlistRepository;
    ProductRepository productRepository;
    WishlistProductMapper wishlistProductMapper;
    UserRepository userRepository;
    WishlistMapper wishlistMapper;

    @Override
    public WishlistDto getByUserId(Integer userId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId)
                .orElseThrow(()-> new AppException(ErrorCode.WISHLIST_USER_NOT_FOUND));

        return wishlistMapper.toDto(wishlist);
    }


    @Override
    @Transactional(readOnly = true)
    public List<WishlistItemDto> getProducts(Integer userId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.WISHLIST_NOT_FOUND));

        if (wishlist == null) return Collections.emptyList();

        return wishlistProductMapper.toItemDtos(wishlist.getProductWishlists());
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addProduct(Integer userId, Integer productId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId).orElseThrow(()-> new AppException(ErrorCode.WISHLIST_NOT_FOUND));


        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Tránh thêm trùng
        boolean alreadyExists = productWishlistRepository
                .existsByWishlistIdAndProductId(wishlist.getId(), productId);
        if (alreadyExists) return;

        ProductWishlist productWishlist = new ProductWishlist();
        productWishlist.setWishlist(wishlist);
        productWishlist.setProduct(product);

        productWishlistRepository.save(productWishlist);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeProduct(Integer userId, Integer productId) {

        ProductWishlist productWishlist = productWishlistRepository
                .findByWishlistIdAndProductId(getWishlistId(userId), productId)
                .orElseThrow(() -> new AppException(ErrorCode.WISHLIST_ITEM_NOT_FOUND));

        productWishlistRepository.delete(productWishlist);
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public WishlistDto create(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlistRepository.save(wishlist);
        return wishlistMapper.toDto(wishlist);
    }

    private Integer getWishlistId(Integer userId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId).orElseThrow(()-> new AppException(ErrorCode.WISHLIST_NOT_FOUND));
        return wishlist.getId();
    }
}