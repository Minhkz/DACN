package com.haui.controller.client;

import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.wishlist.WishlistDto;
import com.haui.dto.response.wishlist.product.WishlistProductDto;
import com.haui.dto.response.wishlist.product.WishlistItemDto;
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

    @GetMapping("/users/{userId}")
    public ResponseResult<WishlistDto> getByUser(@PathVariable Integer userId) {
        return ResponseResult.success(wishlistService.getByUserId(userId));
    }

    @GetMapping("/{id}/products")
    public ResponseResult<List<WishlistItemDto>> getProducts(@PathVariable Integer id) {
        return ResponseResult.success(wishlistService.getProducts(id));
    }

    @PostMapping("/{id}/products")
    public ResponseResult<Void> add(@PathVariable Integer id,
                                    @RequestParam Integer productId) {
        wishlistService.addProduct(id, productId);
        return ResponseResult.success(null);
    }

    @DeleteMapping("/{id}/products/{productId}")
    public ResponseResult<Void> remove(@PathVariable Integer id,
                                       @PathVariable Integer productId) {
        wishlistService.removeProduct(id, productId);
        return ResponseResult.success(null);
    }

    @GetMapping("/{userId}/check/{productId}")
    public ResponseResult<Boolean> check(@PathVariable Integer userId,
                                         @PathVariable Integer productId) {
        return ResponseResult.success(wishlistService.check(userId, productId));
    }

    @PostMapping("/users/{userId}")
    public ResponseResult<WishlistDto> create(@PathVariable("userId") Integer request) {
        return ResponseResult.success(wishlistService.create(request));
    }
}