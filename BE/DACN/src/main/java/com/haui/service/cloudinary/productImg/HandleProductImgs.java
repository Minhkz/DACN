package com.haui.service.cloudinary.productImg;

import com.haui.entity.Product;
import com.haui.entity.ProductImg;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.repository.ProductImgRepository;
import com.haui.repository.ProductRepository;
import com.haui.service.cloudinary.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HandleProductImgs {
    private final CloudinaryService cloudinaryService;
    private final ProductImgRepository productImgRepository;
    private final ProductRepository productRepository;

    @Async
    @Transactional(rollbackFor = Exception.class)
    public void uploadImagesAsync(List<byte[]> files,
                                  Integer productId) {

        try {

            Product product = productRepository
                    .findById(productId)
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

            List<ProductImg> images = new ArrayList<>();

            for (byte[] file : files) {

                String url = cloudinaryService.uploadProductImage(file, productId);

                ProductImg img = new ProductImg();
                img.setProduct(product);
                img.setSrc(url);

                images.add(img);
            }

            productImgRepository.saveAll(images);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void deleteImagesAsync(List<String> publicIds) {

        for (String id : publicIds) {
            cloudinaryService.deleteImage(id);
        }

    }

    @Async
    @Transactional(rollbackFor = Exception.class)
    public void updateImagesAsync(List<byte[]> files,
                                  Integer productId,
                                  List<String> oldPublicIds) {
        try {
            Product product = productRepository
                    .findById(productId)
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

            if (oldPublicIds != null && !oldPublicIds.isEmpty()) {
                for (String oldPublicId : oldPublicIds) {
                    cloudinaryService.deleteImage(oldPublicId);
                }
            }

            List<ProductImg> newImages = new ArrayList<>();

            if (files != null && !files.isEmpty()) {
                for (byte[] file : files) {
                    String publicId = cloudinaryService.uploadProductImage(file, productId);

                    ProductImg img = new ProductImg();
                    img.setProduct(product);
                    img.setSrc(publicId);

                    newImages.add(img);
                }

                productImgRepository.saveAll(newImages);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
