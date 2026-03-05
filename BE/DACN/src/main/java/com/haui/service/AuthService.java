package com.haui.service;

import com.haui.dto.auth.LoginDto;
import com.haui.dto.auth.RegisterDto;

public interface AuthService {
    public String login(LoginDto loginDto);
    public String register(RegisterDto registerDto);
}
