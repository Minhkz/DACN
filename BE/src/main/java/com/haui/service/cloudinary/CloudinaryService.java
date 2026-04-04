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
            String timestamp = String.valueOf(System.currentTimeMillis());
            String publicId = "nhom6/users/" + userId + "/avatar_" + timestamp;

            Map<String, Object> params = new HashMap<>();
            params.put("public_id", publicId);
            params.put("overwrite", true);
            params.put("resource_type", "auto");
            params.put("invalidate", true);

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
            params.put("invalidate", true);

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

    public String updateUserAvatar(byte[] newFileBytes, Integer userId, String oldPublicId) {

        if (newFileBytes == null || newFileBytes.length == 0) {
            throw new RuntimeException("File is empty");
        }

        try {
            // Xóa avatar cũ nếu tồn tại
            if (oldPublicId != null && !oldPublicId.isBlank()) {
                Map<?, ?> deleteResult = cloudinary.uploader().destroy(oldPublicId, ObjectUtils.emptyMap());
                String status = (String) deleteResult.get("result");
                if (!"ok".equals(status) && !"not found".equals(status)) {
                    throw new RuntimeException("Delete old avatar failed");
                }
            }

            String timestamp = String.valueOf(System.currentTimeMillis());
            String newPublicId = "nhom6/users/" + userId + "/avatar_" + timestamp;

            Map<String, Object> params = new HashMap<>();
            params.put("public_id", newPublicId);
            params.put("overwrite", true);
            params.put("resource_type", "auto");
            params.put("invalidate", true);

            Map<?, ?> result = cloudinary.uploader().upload(newFileBytes, params);

            return (String) result.get("public_id");

        } catch (Exception e) {
            throw new RuntimeException("Update avatar failed", e);
        }
    }


    public String updateProductImage(byte[] newFileBytes, Integer productId, String oldPublicId) {

        if (newFileBytes == null || newFileBytes.length == 0) {
            throw new RuntimeException("File is empty");
        }

        try {
            // Xóa ảnh cũ nếu tồn tại
            if (oldPublicId != null && !oldPublicId.isBlank()) {
                Map<?, ?> deleteResult = cloudinary.uploader().destroy(oldPublicId, ObjectUtils.emptyMap());
                String status = (String) deleteResult.get("result");
                if (!"ok".equals(status) && !"not found".equals(status)) {
                    throw new RuntimeException("Delete old product image failed");
                }
            }

            String newPublicId = "nhom6/products/" + productId + "/" + UUID.randomUUID();

            Map<String, Object> params = new HashMap<>();
            params.put("public_id", newPublicId);
            params.put("overwrite", false);
            params.put("resource_type", "auto");
            params.put("invalidate", true);

            Map<?, ?> result = cloudinary.uploader().upload(newFileBytes, params);

            return (String) result.get("public_id");

        } catch (Exception e) {
            throw new RuntimeException("Update product image failed", e);
        }
    }

}