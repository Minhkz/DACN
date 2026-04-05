package com.haui.dto.request.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UserUpdateRequest {
    private Integer id;

    private String username;

    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(
            regexp = "^(0[0-9]{9})$",
            message = "Phone must be 10 digits and start with 0"
    )
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must be less than 100 characters")
    private String fullName;

    private MultipartFile avatar;
}
