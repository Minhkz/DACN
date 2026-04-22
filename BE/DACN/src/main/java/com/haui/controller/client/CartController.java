package com.haui.controller.client;

import com.haui.dto.request.cart.CartItemRequest;
import com.haui.dto.request.cart.CartRequest;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.cart.CartDto;
import com.haui.service.CartService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/carts")
@CrossOrigin(origins = "*", maxAge = 3600)
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class CartController {
    CartService cartService;

    @PostMapping
    public ResponseResult<CartDto> create(@RequestBody @Valid CartRequest request) {
        return ResponseResult.success(cartService.create(request));
    }

    @GetMapping
    public ResponseResult<List<CartDto>> getAll() {
        return ResponseResult.success(cartService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseResult<CartDto> getById(@PathVariable Integer id) {
        return ResponseResult.success(cartService.getById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseResult<CartDto> getByUserId(@PathVariable Integer userId) {
        return ResponseResult.success(cartService.getByUserId(userId));
    }

    @PostMapping("/{cartId}/items")
    public ResponseResult<CartDto> addItem(@PathVariable Integer cartId,
                                           @RequestBody @Valid CartItemRequest request) {
        return ResponseResult.success(cartService.addItem(cartId, request));
    }

    @PutMapping("/{cartId}/items/{itemId}")
    public ResponseResult<CartDto> updateItem(@PathVariable Integer cartId,
                                              @PathVariable Integer itemId,
                                              @RequestBody @Valid CartItemRequest request) {
        return ResponseResult.success(cartService.updateItem(cartId, itemId, request));
    }

    @DeleteMapping("/{cartId}/items/{itemId}")
    public ResponseResult<CartDto> removeItem(@PathVariable Integer cartId,
                                              @PathVariable Integer itemId) {
        return ResponseResult.success(cartService.removeItem(cartId, itemId));
    }

    @DeleteMapping("/{id}")
    public ResponseResult<String> delete(@PathVariable Integer id) {
        cartService.delete(id);
        return ResponseResult.success("Successfully deleted cart");
    }
}
