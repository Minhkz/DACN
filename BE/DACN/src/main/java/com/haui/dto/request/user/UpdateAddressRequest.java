package com.haui.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateAddressRequest {
    @NotBlank(message = "address is required")
    private String address;
}
