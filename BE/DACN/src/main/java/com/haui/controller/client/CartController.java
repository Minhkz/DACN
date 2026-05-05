package com.haui.controller.client;

import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.cart.CartDto;
import com.haui.dto.response.cart.product.CartItemDto;
import com.haui.entity.CustomUserDetails;
import com.haui.middleware.annotation.CurrentUserId;
import com.haui.service.CartService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/carts")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class CartController {
    CartService cartService;

    @PostMapping
    public ResponseResult<CartDto> create(@CurrentUserId Integer userId) {
        return ResponseResult.success(cartService.create(userId));
    }

    @GetMapping
    public ResponseResult<CartDto> getByUser(@CurrentUserId Integer userId) {
        return ResponseResult.success(cartService.getByUserId(userId));
    }

    @GetMapping("/products")
    public ResponseResult<List<CartItemDto>> getProducts(@CurrentUserId Integer userId) {
        return ResponseResult.success(cartService.getProducts(userId));
    }

    @PostMapping("/products")
    public ResponseResult<Void> addProduct(@CurrentUserId Integer userId,
                                           @RequestParam Integer productId,
                                           @RequestParam Integer quantity) {
        cartService.addProduct(userId, productId, quantity);
        return ResponseResult.success(null);
    }

    @PatchMapping("/products/{productId}")
    public ResponseResult<Void> updateQuantity(@CurrentUserId Integer userId,
                                               @PathVariable Integer productId,
                                               @RequestParam Integer quantity) {
        cartService.updateQuantity(userId, productId, quantity);
        return ResponseResult.success(null);
    }

    @DeleteMapping("/products/{productId}")
    public ResponseResult<Void> removeProduct(@CurrentUserId Integer userId,
                                              @PathVariable Integer productId) {
        cartService.removeProduct(userId, productId);
        return ResponseResult.success(null);
    }

    @DeleteMapping("/clear")
    public ResponseResult<Void> clear(@CurrentUserId Integer userId) {
        cartService.clear(userId);
        return ResponseResult.success(null);
    }

    @GetMapping("/products/{productId}/exists")
    public ResponseResult<Boolean> check(@CurrentUserId Integer userId,
                                         @PathVariable Integer productId) {
        return ResponseResult.success(cartService.check(userId, productId));
    }
}