package com.haui.dto.thread.product;

public record UploadProductAvatarEvent(byte[] fileBytes, Integer productId) {}
