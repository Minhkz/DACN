package com.haui.dto.response.product;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDetailDto {
    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private Integer sold;
    private Integer view;
    private String avatar;
    private List<String> imgs;
    private List<String> filters;
}
