package com.haui.dto.request.profile;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CheckPasswordRequest {
    @NotBlank(message = "Mật khẩu hiện tại không được để trống")
    private String currentPassword;
}
