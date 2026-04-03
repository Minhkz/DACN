package com.haui.service;

import com.haui.dto.auth.LoginDto;
import com.haui.dto.auth.RefreshTokenDto;
import com.haui.dto.auth.RegisterDto;
import com.haui.dto.response.jwt.JwtResponse;

public interface AuthService {
    public JwtResponse login(LoginDto request);
    public String register(RegisterDto registerDto);
    public JwtResponse refreshToken(RefreshTokenDto request);
    public String logout(RefreshTokenDto request);
}
