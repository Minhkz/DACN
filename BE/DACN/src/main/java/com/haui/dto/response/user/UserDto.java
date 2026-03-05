package com.haui.dto.response.user;

import lombok.Data;

@Data
public class UserDto {
    private String username;
    private String email;
    private String phone;
    private String address;
    private String fullName;
    private String roleId;
}
