package com.haui.service.impl;

import com.haui.dto.request.profile.UserUpdateProfileRequest;
import com.haui.dto.response.user.UserDetailDto;
import com.haui.dto.thread.user.UpdateUserAvatarEvent;
import com.haui.entity.User;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.mapper.UserMapper;
import com.haui.repository.UserRepository;
import com.haui.service.ProfileService;
import com.haui.service.cloudinary.CloudinaryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {
    UserRepository userRepository;
    CloudinaryService cloudinaryService;
    PasswordEncoder passwordEncoder;
    ApplicationEventPublisher eventPublisher;
    UserMapper userMapper;

    private void validateProfileInfo(UserUpdateProfileRequest request) {
        if (!hasText(request.getFullName())) {
            throw new AppException(ErrorCode.FULL_NAME_REQUIRED);
        }

        if (request.getFullName().trim().length() < 8
                || request.getFullName().trim().length() > 30) {
            throw new AppException(ErrorCode.FULL_NAME_INVALID);
        }

        if (!hasText(request.getPhone())) {
            throw new AppException(ErrorCode.PHONE_REQUIRED);
        }

        if (!request.getPhone().trim().matches("^[0-9]{10,11}$")) {
            throw new AppException(ErrorCode.PHONE_INVALID);
        }

        if (!hasText(request.getAddress())) {
            throw new AppException(ErrorCode.ADDRESS_REQUIRED);
        }

        if (request.getAddress().trim().length() < 5) {
            throw new AppException(ErrorCode.ADDRESS_INVALID);
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private void validatePasswordChange(User user, UserUpdateProfileRequest request) {
        if (!hasText(request.getCurrentPassword())) {
            throw new AppException(ErrorCode.CURRENT_PASSWORD_REQUIRED);
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_INCORRECT);
        }

        if (!hasText(request.getNewPassword())) {
            throw new AppException(ErrorCode.NEW_PASSWORD_REQUIRED);
        }

        if (!hasText(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.CONFIRM_PASSWORD_REQUIRED);
        }

        String newPassword = request.getNewPassword();

        if (newPassword.length() < 6 || newPassword.length() > 16) {
            throw new AppException(ErrorCode.PASSWORD_INVALID_LENGTH);
        }

        if (!newPassword.matches("^(?=.*[A-Z])(?=.*[^a-zA-Z0-9])\\S{6,16}$")) {
            throw new AppException(ErrorCode.PASSWORD_INVALID);
        }

        if (!newPassword.equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.PASSWORD_CONFIRM_NOT_MATCH);
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new AppException(ErrorCode.NEW_PASSWORD_SAME_OLD_PASSWORD);
        }
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserDetailDto updateMe(Integer userId, UserUpdateProfileRequest request) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
        validateProfileInfo(request);
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        boolean wantsChangePassword = hasText(request.getCurrentPassword()) || hasText(request.getNewPassword()) || hasText(request.getConfirmPassword());

        if (wantsChangePassword) {
            validatePasswordChange(user, request);
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        MultipartFile file = request.getAvatar();
        if (file != null && !file.isEmpty()) {
            byte[] fileBytes = file.getBytes();

            eventPublisher.publishEvent(
                    new UpdateUserAvatarEvent(fileBytes, user.getId())
            );
        }
        return transfer(user);
    }

    @Override
    public boolean checkCurrentPassword(Integer userId, String currentPassword) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!hasText(currentPassword)) {
            return false;
        }

        return passwordEncoder.matches(currentPassword, user.getPassword());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateAddress(Integer userId, String address) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setAddress(address.trim());

        userRepository.save(user);
    }

    private UserDetailDto transfer(User user) {
        String img= cloudinaryService.getImageUrl(user.getAvatar());

        UserDetailDto dto = new UserDetailDto();
        dto.setId(user.getId());
        dto.setAvatar(img);
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRoleId(user.getRole().getName());
        dto.setAddress(user.getAddress());
        dto.setPhone(user.getPhone());
        dto.setFullName(user.getFullName());
        return dto;
    }
}
