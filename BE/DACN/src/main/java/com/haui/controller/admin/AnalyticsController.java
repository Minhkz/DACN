package com.haui.controller.admin;

import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.analytics.AbandonedCartDto;
import com.haui.dto.response.analytics.CartAdditionStatsDto;
import com.haui.dto.response.analytics.ProductViewStatsDto;
import com.haui.service.analytics.AnalyticsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AnalyticsController {
    AnalyticsService analyticsService;

    @GetMapping("/product-views")
    public ResponseResult<List<ProductViewStatsDto>> getProductViews(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseResult.success(analyticsService.getTopProductViews(limit));
    }

    @GetMapping("/cart-additions")
    public ResponseResult<List<CartAdditionStatsDto>> getCartAdditions(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseResult.success(analyticsService.getTopAddToCartProducts(limit));
    }

    @GetMapping("/abandoned-carts")
    public ResponseResult<List<AbandonedCartDto>> getAbandonedCarts(
            @RequestParam(defaultValue = "24") int hours
    ) {
        return ResponseResult.success(analyticsService.getAbandonedCarts(hours));
    }
}
