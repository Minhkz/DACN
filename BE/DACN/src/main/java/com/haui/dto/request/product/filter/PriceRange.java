package com.haui.dto.request.product.filter;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PriceRange {
    private BigDecimal min;
    private BigDecimal max;
}
