package com.haui.service.cloudinary.product;

import com.haui.entity.Product;
import com.haui.entity.User;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.repository.ProductRepository;
import com.haui.repository.UserRepository;
import com.haui.service.cloudinary.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HandleProductImg {
    private final CloudinaryService cloudinaryService;
    private final ProductRepository productRepository;

    @Async
    @Transactional(rollbackFor = Exception.class)
    public void uploadAvatarAsync(byte[] fileBytes,
                                  Integer productId) {
        try {
            String url = cloudinaryService.uploadProductImage(fileBytes, productId);

            Product product = productRepository.findById(productId).orElseThrow(()-> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
            product.setAvatar(url);
            productRepository.save(product);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    @Transactional(rollbackFor = Exception.class)
    public void updateAvatarAsync(byte[] fileBytes,
                                  Integer productId) {
        try {
            String url = cloudinaryService.uploadProductImage(fileBytes, productId);

            Product product = productRepository.findById(productId).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
            product.setAvatar(url);
            productRepository.save(product);

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
