package com.haui.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public final class PageableUtil {

    private PageableUtil() {
    }

    public static Pageable buildPageable(int page, int size, List<String> sorts) {
        int safePage = Math.max(page, 0);
        int safeSize = size <= 0 ? 10 : size;
        return PageRequest.of(safePage, safeSize, buildSort(sorts));
    }

    public static Sort buildSort(List<String> sorts) {
        List<Sort.Order> orders = new ArrayList<>();

        if (sorts != null && !sorts.isEmpty()) {
            for (String rawSort : sorts) {
                if (!StringUtils.hasText(rawSort)) {
                    continue;
                }

                String[] parts = rawSort.split("\\.", 2);
                String field = parts[0].trim();

                if (!StringUtils.hasText(field)) {
                    continue;
                }

                String direction = parts.length > 1 ? parts[1].trim() : "asc";
                Sort.Direction sortDirection =
                        "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;

                orders.add(new Sort.Order(sortDirection, field));
            }
        }

        if (orders.isEmpty()) {
            orders.add(new Sort.Order(Sort.Direction.DESC, "id"));
        }

        return Sort.by(orders);
    }
}