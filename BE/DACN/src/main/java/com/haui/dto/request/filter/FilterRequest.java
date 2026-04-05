package com.haui.dto.request.filter;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class FilterRequest {
    private Integer id;

    @NotBlank(message = "Filter name must not be blank")
    @Size(max = 100, message = "Filter name must be less than 100 characters")
    private String name;

    @NotBlank(message = "Filter type must not be blank")
    @Size(max = 50, message = "Filter type must be less than 50 characters")
    private String type;
}
