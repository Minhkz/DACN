package com.haui.service.analytics;

import com.haui.dto.response.analytics.AbandonedCartDto;
import com.haui.dto.response.analytics.CartAdditionStatsDto;
import com.haui.dto.response.analytics.ProductViewStatsDto;

import java.util.List;

public interface AnalyticsService {
    List<ProductViewStatsDto> getTopProductViews(int limit);

    List<CartAdditionStatsDto> getTopAddToCartProducts(int limit);

    List<AbandonedCartDto> getAbandonedCarts(int hours);
}
