package com.haui.dto.request.product;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {
    private Integer id;

    @NotBlank(message = "Product name must not be blank")
    @Size(max = 255, message = "Product name must be less than 255 characters")
    private String name;

    @NotBlank(message = "Description must not be blank")
    @Size(max = 500, message = "Description must be less than 500 characters")
    private String description;

    @NotNull(message = "Price must not be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Quantity must not be null")
    @PositiveOrZero(message = "Quantity must be greater than or equal to 0")
    private Integer quantity;

    private Integer sold = 0;

    private Integer view = 0;

    @NotNull(message = "Avatar image is required")
    private MultipartFile avatar;

    @Size(max = 10, message = "Maximum 10 images allowed")
    private List<MultipartFile> images;

    @NotEmpty(message = "Filters must not be empty")
    private List<Integer> filters;
}
