package com.haui.service.cloudinary.productImg;

import com.haui.dto.thread.productImg.DeleteProductImagesAvatarEvent;
import com.haui.dto.thread.productImg.UploadProductImagesEvent;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ProductImagesAvatarEventListener {
    HandleProductImgs productImg;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleUploadImages(UploadProductImagesEvent event) {

        productImg.uploadImagesAsync(
                event.images(),
                event.productId()
        );
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleDeleteImages(DeleteProductImagesAvatarEvent event) {

        productImg.deleteImagesAsync(event.publicIds());
    }

}
