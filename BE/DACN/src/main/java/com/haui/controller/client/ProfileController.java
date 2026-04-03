package com.haui.controller.client;

import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.user.UserDetailDto;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.repository.UserRepository;
import com.haui.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/profile")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class ProfileController {
    UserService userService;

    @GetMapping("/me")
    public ResponseResult<UserDetailDto> getMyProfile(Principal principal) {
        Integer id = Integer.parseInt(principal.getName());

        UserDetailDto currentUser = userService.getUserById(id);

        return ResponseResult.success(currentUser);
    }
}
