package com.haui.dto.auth;

import lombok.Data;

@Data
public class RegisterDto {
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String phone;
    private String address;
}
