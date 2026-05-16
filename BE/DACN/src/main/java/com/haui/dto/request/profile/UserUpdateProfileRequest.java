package com.haui.dto.request.profile;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UserUpdateProfileRequest {
    private String fullName;
    private String phone;
    private String address;

    private String currentPassword;
    private String newPassword;
    private String confirmPassword;

    private MultipartFile avatar;
}
