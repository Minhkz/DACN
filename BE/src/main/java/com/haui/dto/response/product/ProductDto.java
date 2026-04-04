package com.haui.dto.response.product;

import com.haui.entity.Filter;
import com.haui.entity.ProductImg;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDto {
    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private Integer sold;
    private Integer view;
}
