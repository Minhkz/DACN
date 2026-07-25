package com.haui.service.recommendation;

import java.util.Map;

public interface ItemBasedCFService {
    Map<Integer, Double> recommendFrequentlyBoughtTogether(Integer productId, int topN);
}
