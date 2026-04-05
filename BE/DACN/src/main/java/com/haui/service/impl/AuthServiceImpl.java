package com.haui.service.impl;

import com.haui.dto.auth.LoginDto;
import com.haui.dto.auth.RefreshTokenDto;
import com.haui.dto.auth.RegisterDto;
import com.haui.dto.response.jwt.JwtResponse;
import com.haui.entity.RefreshToken;
import com.haui.entity.Role;
import com.haui.entity.User;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.repository.RefreshTokenRepository;
import com.haui.repository.RoleRepository;
import com.haui.repository.UserRepository;
import com.haui.security.JwtTokenProvider;
import com.haui.service.AuthService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    AuthenticationManager authenticationManager;
    JwtTokenProvider jwtTokenProvider;
    RoleRepository roleRepository;
    RefreshTokenRepository refreshTokenRepository;

    @Override
    public JwtResponse login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsername(),
                        loginDto.getPassword()
                )
        );

        User user = userRepository
                .findByUsername(loginDto.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String accessToken = jwtTokenProvider.generateToken(authentication, user.getId());

        String refreshToken = UUID.randomUUID().toString();

        RefreshToken entity = RefreshToken.builder()
                .token(refreshToken)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .user(user)
                .build();

        refreshTokenRepository.save(entity);

        return new JwtResponse(accessToken, refreshToken);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String register(RegisterDto registerDto) {
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setEmail(registerDto.getEmail());
        user.setPhone(registerDto.getPhone());
        user.setAddress(registerDto.getAddress());
        user.setFullName(registerDto.getFullName());
        Role role = roleRepository.findById(2).orElseThrow(()-> new AppException(ErrorCode.ROLE_NOT_FOUND));
        user.setRole(role);
        userRepository.save(user);
        return "User registered successfully";
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public JwtResponse refreshToken(RefreshTokenDto request) {

        RefreshToken token = refreshTokenRepository
                .findByToken(request.getRefreshToken())
                .orElseThrow(() -> new AppException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_EXPIRED);
        }

        User user = token.getUser();

        String accessToken = jwtTokenProvider.generateTokenFromUsername(
                user.getUsername(),
                user.getId()
        );

        String newRefreshToken = UUID.randomUUID().toString();

        refreshTokenRepository.delete(token);

        RefreshToken entity = RefreshToken.builder()
                .token(newRefreshToken)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .user(user)
                .build();

        refreshTokenRepository.save(entity);

        return new JwtResponse(accessToken, newRefreshToken);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String logout(RefreshTokenDto request) {
        RefreshToken token = refreshTokenRepository
                .findByToken(request.getRefreshToken())
                .orElseThrow(() -> new AppException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));

        refreshTokenRepository.delete(token);

        return "Logout successful";
    }
}
