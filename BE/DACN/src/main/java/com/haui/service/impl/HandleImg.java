package com.haui.service.impl;

import com.haui.entity.User;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.repository.UserRepository;
import com.haui.service.cloudinary.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HandleImg {
    private final CloudinaryService cloudinaryService;
    private final UserRepository userRepository;

    @Async
    public void uploadAvatarAsync(byte[] fileBytes,
                                  Boolean isUser,
                                  Integer userId) {
        try {
            String url = cloudinaryService.upload(fileBytes, isUser, userId);

            User user = userRepository.findById(userId).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
            user.setAvatar(url);
            userRepository.save(user);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void updateAvatarAsync(byte[] fileBytes,
                                  Boolean isUser,
                                  Integer userId) {
        try {
            String url = cloudinaryService.update(fileBytes, isUser, userId);

            User user = userRepository.findById(userId).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
            user.setAvatar(url);
            userRepository.save(user);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void deleteAvatarAsync(Boolean isUser,
                                  Integer userId) {
        try {
            cloudinaryService.delete(isUser, userId);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
