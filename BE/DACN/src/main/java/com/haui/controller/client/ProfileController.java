package com.haui.controller.client;

import com.haui.dto.request.profile.CheckPasswordRequest;
import com.haui.dto.request.profile.UserUpdateProfileRequest;
import com.haui.dto.request.user.UpdateAddressRequest;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.user.UserDetailDto;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.middleware.annotation.CurrentUserId;
import com.haui.repository.UserRepository;
import com.haui.service.ProfileService;
import com.haui.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/profile")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class ProfileController {
    UserService userService;
    ProfileService profileService;

    @GetMapping("/me")
    public ResponseResult<UserDetailDto> getMyProfile(@CurrentUserId Integer userId) {
        UserDetailDto currentUser = userService.getUserById(userId);

        return ResponseResult.success(currentUser);
    }

    @PutMapping("/me/address")
    public ResponseResult<Void> updateAddress(
            @CurrentUserId Integer userId,
            @RequestBody UpdateAddressRequest request
    ) {
        profileService.updateAddress(userId, request.getAddress());
        return ResponseResult.success(null);
    }

    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseResult<UserDetailDto> updateMe(
            @CurrentUserId Integer userId,
            @ModelAttribute UserUpdateProfileRequest request
    ) throws IOException {
        UserDetailDto data = profileService.updateMe(userId, request);

        return ResponseResult.success(data);
    }

    @PostMapping("/me/check-password")
    public ResponseResult<Boolean> checkCurrentPassword(
            @CurrentUserId Integer userId,
            @Valid @RequestBody CheckPasswordRequest request
    ) {
        boolean valid = profileService.checkCurrentPassword(
                userId,
                request.getCurrentPassword()
        );

        return ResponseResult.success(valid);
    }
}
