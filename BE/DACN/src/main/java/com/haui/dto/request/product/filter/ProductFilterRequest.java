package com.haui.dto.request.product.filter;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ProductFilterRequest {
    private PriceRange price;
    private Map<String, List<Integer>> filters;
    private String sort;
    private Integer page;
    private Integer size;
}
