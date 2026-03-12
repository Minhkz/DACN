package com.haui.dto.thread.product;


public record UpdateProductAvatarEvent(byte[] fileBytes, Integer productId) {}
