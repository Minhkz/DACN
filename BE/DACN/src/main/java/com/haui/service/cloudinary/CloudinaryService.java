package com.haui.service.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public String upload(byte[] fileBytes, Boolean isUser, Integer userId) {

        if (fileBytes == null || fileBytes.length == 0) {
            throw new RuntimeException("File is empty");
        }

        try {

            String publicId = "users/" + userId + "_" + (isUser ? "user" : "product");

            Map<String, Object> params = new HashMap<>();
            params.put("public_id", publicId);
            params.put("overwrite", true);
            params.put("resource_type", "auto");

            Map<?, ?> data = cloudinary.uploader().upload(fileBytes, params);

            return (String) data.get("secure_url");

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Image upload fail", e);
        }
    }

    public String update(byte[] fileBytes, Boolean isUser, Integer userId) {
        if (fileBytes == null || fileBytes.length == 0) {
            throw new RuntimeException("File is empty");
        }

        try {
            String publicId = "users/" + userId + "_" + (isUser ? "user" : "product");

            Map<String, Object> params = new HashMap<>();
            params.put("public_id", publicId);
            params.put("overwrite", true);
            params.put("resource_type", "auto");

            Map<?, ?> data = cloudinary.uploader().upload(fileBytes, params);

            return (String) data.get("secure_url");

        } catch (IOException e) {
            throw new RuntimeException("Avatar update fail");
        }
    }

    public void delete(Boolean isUser, Integer userId) {
        try {

            String publicId = "users/" + userId + "_" + (isUser ? "user" : "product");

            Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

            String status = (String) result.get("result");

            if (!"ok".equals(status)) {
                throw new RuntimeException("Delete image failed");
            }

        } catch (Exception e) {
            throw new RuntimeException("Delete image fail", e);
        }
    }

    public String getImageUrl(Boolean isUser, Integer userId) {

        String publicId = "users/" + userId + "_" + (isUser ? "user" : "product");

        return cloudinary.url()
                .secure(true)
                .generate(publicId);
    }
}
