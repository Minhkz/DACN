package com.haui.controller.client;

import com.haui.dto.request.user.UpdateAddressRequest;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.user.UserDetailDto;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.middleware.annotation.CurrentUserId;
import com.haui.repository.UserRepository;
import com.haui.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/profile")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class ProfileController {
    UserService userService;

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
        userService.updateAddress(userId, request.getAddress());
        return ResponseResult.success(null);
    }
}
