package com.haui.service.cloudinary.user;

import com.haui.entity.User;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.repository.UserRepository;
import com.haui.service.cloudinary.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HandleUserImg {
    private final CloudinaryService cloudinaryService;
    private final UserRepository userRepository;

    @Async
    @Transactional(rollbackFor = Exception.class)
    public void uploadAvatarAsync(byte[] fileBytes,
                                  Integer userId) {
        try {
            String url = cloudinaryService.uploadUserAvatar(fileBytes, userId);

            User user = userRepository.findById(userId).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
            user.setAvatar(url);
            userRepository.save(user);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    @Transactional(rollbackFor = Exception.class)
    public void updateAvatarAsync(byte[] fileBytes,
                                  Integer userId) {
        try {
            User user = userRepository.findById(userId).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
            String url = cloudinaryService.updateUserAvatar(fileBytes, userId,  user.getAvatar());
            user.setAvatar(url);
            userRepository.save(user);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void deleteAvatarAsync(String publicId) {
        try {
            cloudinaryService.deleteImage(publicId);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
