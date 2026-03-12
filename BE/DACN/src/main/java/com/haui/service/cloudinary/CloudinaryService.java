package com.haui.service.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;


    public String uploadUserAvatar(byte[] fileBytes, Integer userId) {

        if (fileBytes == null || fileBytes.length == 0) {
            throw new RuntimeException("File is empty");
        }

        try {

            String publicId = "nhom6/users/" + userId + "/avatar";

            Map<String, Object> params = new HashMap<>();
            params.put("public_id", publicId);
            params.put("overwrite", true);
            params.put("resource_type", "auto");

            Map<?, ?> result = cloudinary.uploader().upload(fileBytes, params);

            return (String) result.get("public_id");

        } catch (Exception e) {
            throw new RuntimeException("Upload avatar failed", e);
        }
    }


    public String uploadProductImage(byte[] fileBytes, Integer productId) {

        if (fileBytes == null || fileBytes.length == 0) {
            throw new RuntimeException("File is empty");
        }

        try {

            String publicId = "nhom6/products/" + productId + "/" + UUID.randomUUID();

            Map<String, Object> params = new HashMap<>();
            params.put("public_id", publicId);
            params.put("overwrite", false);
            params.put("resource_type", "auto");

            Map<?, ?> result = cloudinary.uploader().upload(fileBytes, params);

            return (String) result.get("public_id");

        } catch (Exception e) {
            throw new RuntimeException("Upload product image failed", e);
        }
    }



    public void deleteImage(String publicId) {

        try {

            Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

            String status = (String) result.get("result");

            if (!"ok".equals(status)) {
                throw new RuntimeException("Delete image failed");
            }

        } catch (Exception e) {
            throw new RuntimeException("Delete image failed", e);
        }
    }



    public String getImageUrl(String publicId) {

        return cloudinary.url()
                .secure(true)
                .generate(publicId);
    }

}