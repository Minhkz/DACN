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

    // GET /wishlists/users/{userId}
    @Override
    @Transactional
    public WishlistDto getByUserId(Integer userId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId)
                .orElseThrow(()-> new AppException(ErrorCode.WISHLIST_USER_NOT_FOUND));

        return wishlistMapper.toDto(wishlist);
    }

    // GET /wishlists/{id}/products
    @Override
    @Transactional(readOnly = true)
    public List<WishlistItemDto> getProducts(Integer wishlistId) {
        Wishlist wishlist = wishlistRepository.findById(wishlistId)
                .orElseThrow(() -> new AppException(ErrorCode.WISHLIST_NOT_FOUND));

        return wishlistProductMapper.toItemDtos(wishlist.getProductWishlists());
    }

    // POST /wishlists/{id}/products?productId=...
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addProduct(Integer wishlistId, Integer productId) {
        Wishlist wishlist = wishlistRepository.findById(wishlistId)
                .orElseThrow(() -> new AppException(ErrorCode.WISHLIST_NOT_FOUND));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Tránh thêm trùng
        boolean alreadyExists = productWishlistRepository
                .existsByWishlistIdAndProductId(wishlistId, productId);
        if (alreadyExists) return;

        ProductWishlist productWishlist = new ProductWishlist();
        productWishlist.setWishlist(wishlist);
        productWishlist.setProduct(product);

        productWishlistRepository.save(productWishlist);
    }

    // DELETE /wishlists/{id}/products/{productId}
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeProduct(Integer wishlistId, Integer productId) {
        ProductWishlist productWishlist = productWishlistRepository
                .findByWishlistIdAndProductId(wishlistId, productId)
                .orElseThrow(() -> new AppException(ErrorCode.WISHLIST_ITEM_NOT_FOUND));

        productWishlistRepository.delete(productWishlist);
    }

    // GET /wishlists/{userId}/check/{productId}
    @Override
    public boolean check(Integer userId, Integer productId) {
        return wishlistRepository.findByUserId(userId)
                .map(w -> productWishlistRepository
                        .existsByWishlistIdAndProductId(w.getId(), productId))
                .orElse(false);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public WishlistDto create(Integer request) {
        User user = userRepository.findById(request).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlistRepository.save(wishlist);
        return wishlistMapper.toDto(wishlist);
    }
}