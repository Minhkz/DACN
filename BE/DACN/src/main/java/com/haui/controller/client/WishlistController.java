package com.haui.controller.client;

import com.haui.dto.request.wishlist.WishlistItemRequest;
import com.haui.dto.request.wishlist.WishlistRequest;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.wishlist.WishlistDto;
import com.haui.service.WishlistService;
import jakarta.validation.Valid;
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

    @PostMapping
    public ResponseResult<WishlistDto> create(@RequestBody @Valid WishlistRequest request) {
        return ResponseResult.success(wishlistService.create(request));
    }

    @GetMapping
    public ResponseResult<List<WishlistDto>> getAll() {
        return ResponseResult.success(wishlistService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseResult<WishlistDto> getById(@PathVariable Integer id) {
        return ResponseResult.success(wishlistService.getById(id));
    }

    @GetMapping("/users/{userId}")
    public ResponseResult<WishlistDto> getByUserId(@PathVariable Integer userId) {
        return ResponseResult.success(wishlistService.getByUserId(userId));
    }

    @PostMapping("/{wishlistId}/items")
    public ResponseResult<WishlistDto> addItem(@PathVariable Integer wishlistId,
                                               @RequestBody @Valid WishlistItemRequest request) {
        return ResponseResult.success(wishlistService.addItem(wishlistId, request));
    }

    @DeleteMapping("/{wishlistId}/items/{itemId}")
    public ResponseResult<WishlistDto> removeItem(@PathVariable Integer wishlistId,
                                                  @PathVariable Integer itemId) {
        return ResponseResult.success(wishlistService.removeItem(wishlistId, itemId));
    }

    @DeleteMapping("/{id}")
    public ResponseResult<String> delete(@PathVariable Integer id) {
        wishlistService.delete(id);
        return ResponseResult.success("Successfully deleted wishlist");
    }
}
