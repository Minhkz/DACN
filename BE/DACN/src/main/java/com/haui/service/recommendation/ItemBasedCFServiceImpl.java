package com.haui.service.recommendation;

import com.haui.repository.ProductOrderRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
@RequiredArgsConstructor
public class ItemBasedCFServiceImpl implements ItemBasedCFService {
    ProductOrderRepository productOrderRepository;

    @Override
    public Map<Integer, Double> recommendFrequentlyBoughtTogether(Integer productId, int topN) {
        List<Integer> orderIds = productOrderRepository.findOrderIdsByProductId(productId);
        if (orderIds.isEmpty()) {
            return Map.of();
        }

        Long countA = productOrderRepository.countOrdersContaining(productId);
        Long totalOrders = productOrderRepository.countTotalOrders();
        if (countA == 0 || totalOrders == 0) {
            return Map.of();
        }

        List<Object[]> raw = productOrderRepository.countCoOccurrence(orderIds, productId);
        if (raw.isEmpty()) {
            return Map.of();
        }

        Map<Integer, Double> scored = new LinkedHashMap<>();
        for (Object[] row : raw) {
            Integer productB = (Integer) row[0];
            Long countAB = (Long) row[1];

            Long countB = productOrderRepository.countOrdersContaining(productB);
            if (countB == 0) continue;

            double confidence = countAB / (double) countA;
            double supportB = countB / (double) totalOrders;
            double lift = confidence / supportB;

            scored.put(productB, lift);
        }

        return scored.entrySet().stream()
                .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                .limit(topN)
                .collect(LinkedHashMap::new, (m, e) -> m.put(e.getKey(), e.getValue()), Map::putAll);
    }
}
