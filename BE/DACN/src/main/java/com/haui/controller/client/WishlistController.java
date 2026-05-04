package com.haui.controller.client;

import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.wishlist.WishlistDto;
import com.haui.dto.response.wishlist.product.WishlistItemDto;
import com.haui.middleware.annotation.CurrentUserId;
import com.haui.service.WishlistService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlists")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class WishlistController {

    WishlistService wishlistService;

    @GetMapping
    public ResponseResult<WishlistDto> getMyWishlist(@CurrentUserId Integer userId) {
        return ResponseResult.success(wishlistService.getByUserId(userId));
    }

    @PostMapping
    public ResponseResult<WishlistDto> create(@CurrentUserId Integer userId) {
        return ResponseResult.success(wishlistService.create(userId));
    }

    @GetMapping("/products")
    public ResponseResult<List<WishlistItemDto>> getProducts(@CurrentUserId Integer userId) {
        return ResponseResult.success(wishlistService.getProducts(userId));
    }

    @PostMapping("/products")
    public ResponseResult<Void> addProduct(@CurrentUserId Integer userId,
                                           @RequestParam Integer productId) {
        wishlistService.addProduct(userId, productId);
        return ResponseResult.success(null);
    }

    @DeleteMapping("/products/{productId}")
    public ResponseResult<Void> removeProduct(@CurrentUserId Integer userId,
                                              @PathVariable Integer productId) {
        wishlistService.removeProduct(userId, productId);
        return ResponseResult.success(null);
    }
}