package com.haui.controller.admin;


import com.haui.dto.request.wishlist.WishlistRequest;
import com.haui.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @PostMapping("/toggle")
    public boolean toggle(@RequestBody WishlistRequest request) {
        return wishlistService.toggle(request);
    }

    @GetMapping("/check")
    public boolean check(
            @RequestParam Integer userId,
            @RequestParam Integer productId) {

        return wishlistService.isLiked(userId, productId);
    }

    @GetMapping
    public Object get(@RequestParam Integer userId) {
        return wishlistService.getByUser(userId);
    }
}