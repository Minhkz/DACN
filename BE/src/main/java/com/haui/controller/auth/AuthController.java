package com.haui.controller.auth;


import com.haui.dto.auth.LoginDto;
import com.haui.dto.auth.RefreshTokenDto;
import com.haui.dto.auth.RegisterDto;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.jwt.JwtResponse;
import com.haui.service.AuthService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*",  maxAge = 3600)
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
@RequiredArgsConstructor
public class AuthController {
    AuthService authService;

    @PostMapping("/login")
    public ResponseResult<JwtResponse> login(@RequestBody @Valid LoginDto request) {
        return ResponseResult.success(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseResult<String> register(@RequestBody @Valid RegisterDto registerDto) {
        return ResponseResult.success(authService.register(registerDto));
    }

    @PostMapping("/refresh-token")
    public ResponseResult<JwtResponse> refreshToken(@RequestBody RefreshTokenDto request) {
        return ResponseResult.success(authService.refreshToken(request));
    }


}
