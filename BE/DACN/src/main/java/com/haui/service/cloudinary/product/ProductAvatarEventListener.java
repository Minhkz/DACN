package com.haui.service.cloudinary.product;

import com.haui.dto.thread.product.DeleteProductAvatarEvent;
import com.haui.dto.thread.product.UpdateProductAvatarEvent;
import com.haui.dto.thread.product.UploadProductAvatarEvent;
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
public class ProductAvatarEventListener {
    HandleProductImg productImg;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleDeleteAvatar(DeleteProductAvatarEvent event) {
        productImg.deleteAvatarAsync(event.publicId());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleUploadAvatar(UploadProductAvatarEvent event) {
        productImg.uploadAvatarAsync(event.fileBytes(), event.productId());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleUpdateAvatar(UpdateProductAvatarEvent event) {
        productImg.updateAvatarAsync(event.fileBytes(), event.productId(), event.oldPublicId());
    }
}
