package com.haui.service.cloudinary.user;

import com.haui.dto.thread.user.DeleteUserAvatarEvent;
import com.haui.dto.thread.user.UpdateUserAvatarEvent;
import com.haui.dto.thread.user.UploadUserAvatarEvent;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class UserAvatarEventListener {
    HandleUserImg handleImg;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleDeleteAvatar(DeleteUserAvatarEvent event) {
        handleImg.deleteAvatarAsync(event.publicId());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleUploadAvatar(UploadUserAvatarEvent event) {
        handleImg.uploadAvatarAsync(event.fileBytes(), event.userId());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleUpdateAvatar(UpdateUserAvatarEvent event) {
        handleImg.updateAvatarAsync(event.fileBytes(), event.userId());
    }
}
