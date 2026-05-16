package com.haui.service;

import com.haui.dto.request.profile.UserUpdateProfileRequest;
import com.haui.dto.response.user.UserDetailDto;

import java.io.IOException;

public interface ProfileService {
    UserDetailDto updateMe(Integer userId, UserUpdateProfileRequest request) throws IOException;

    boolean checkCurrentPassword(Integer userId, String currentPassword);

    void updateAddress(Integer userId, String address);
}
