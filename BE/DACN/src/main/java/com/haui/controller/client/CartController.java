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

    @GetMapping("/users/{userId}")
    public ResponseResult<CartDto> getByUser(@PathVariable Integer userId) {
        return ResponseResult.success(cartService.getByUserId(userId));
    }

    @GetMapping("/{id}/products")
    public ResponseResult<List<CartItemDto>> getProducts(@PathVariable Integer id) {
        return ResponseResult.success(cartService.getProducts(id));
    }

    @PostMapping("/{id}/products")
    public ResponseResult<Void> addProduct(@PathVariable Integer id,
                                           @RequestParam Integer productId,
                                           @RequestParam Integer quantity) {
        cartService.addProduct(id, productId, quantity);
        return ResponseResult.success(null);
    }

    @PatchMapping("/{id}/products/{productId}")
    public ResponseResult<Void> updateQuantity(@PathVariable Integer id,
                                               @PathVariable Integer productId,
                                               @RequestParam Integer quantity) {
        cartService.updateQuantity(id, productId, quantity);
        return ResponseResult.success(null);
    }

    @DeleteMapping("/{id}/products/{productId}")
    public ResponseResult<Void> removeProduct(@PathVariable Integer id,
                                              @PathVariable Integer productId) {
        cartService.removeProduct(id, productId);
        return ResponseResult.success(null);
    }

    @DeleteMapping("/{id}/clear")
    public ResponseResult<Void> clear(@PathVariable Integer id) {
        cartService.clear(id);
        return ResponseResult.success(null);
    }

    @GetMapping("/{id}/products/{productId}/exists")
    public ResponseResult<Boolean> check(@PathVariable Integer id,
                                         @PathVariable Integer productId) {
        return ResponseResult.success(cartService.check(id, productId));
    }
}