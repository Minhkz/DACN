package com.haui.dto.thread.user;

public record UploadUserAvatarEvent(byte[] fileBytes, Integer userId) {}
