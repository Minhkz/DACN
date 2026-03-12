package com.haui.dto.thread.user;


public record UpdateUserAvatarEvent(byte[] fileBytes, Integer userId) {}
