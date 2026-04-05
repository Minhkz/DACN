package com.haui.dto.request.user;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UserRequest {
    private Integer id;

    @NotBlank(message = "Username is required")
    @Size(min = 4, max = 50, message = "Username must be between 4 and 50 characters")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Email is required")
    @Email(message = "Email is invalid")
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

    @NotNull(message = "Role ID is required")
    private Integer roleId;

}
