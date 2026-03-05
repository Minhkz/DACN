package com.haui.service.impl;

import com.haui.dto.response.user.UserDetailDto;
import com.haui.dto.response.user.UserDto;
import com.haui.dto.request.user.UserRequest;
import com.haui.dto.request.user.UserUpdateRequest;
import com.haui.entity.Role;
import com.haui.entity.User;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.mapper.UserMapper;
import com.haui.repository.RoleRepository;
import com.haui.repository.UserRepository;
import com.haui.service.UserService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    UserMapper userMapper;
    RoleRepository roleRepository;
    HandleImg handleImg;

    private void validateLogic(UserRequest request) {
        if(userRepository.existsByUsernameOrEmail(request.getUsername(), request.getEmail())) {
            throw  new AppException(ErrorCode.USER_ALREADY_EXISTS);
        }
    }
    private void validateLogic(UserUpdateRequest request) {
        if (userRepository.existsByUsernameAndIdNot(request.getUsername(), request.getId())) {
            throw new AppException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }

        if (userRepository.existsByEmailAndIdNot(request.getEmail(), request.getId())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
    }

    @Override
    @Transactional
    public UserDto create(UserRequest request) throws IOException {

        validateLogic(request);

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        User entity = userMapper.toCreate(request);
        entity.setRole(role);
        entity.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(entity);

        MultipartFile file = request.getAvatar();
        if (file != null && !file.isEmpty()) {
            byte[] fileBytes = file.getBytes();

            handleImg.uploadAvatarAsync(fileBytes, true, entity.getId());
        }
        UserDto dto = userMapper.toDto(entity);
        dto.setRoleId(role.getName());
        return dto;
    }

    @Override
    @Transactional
    public UserDto update(Integer id, UserUpdateRequest request) throws IOException {
        request.setId(id);
        validateLogic(request);

        User entity = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        userMapper.partialUpdate(entity, request);
        userRepository.save(entity);

        MultipartFile file = request.getAvatar();
        if (file != null && !file.isEmpty()) {
            byte[] fileBytes = file.getBytes();

            handleImg.updateAvatarAsync(fileBytes, true, entity.getId());
        }
        UserDto dto = userMapper.toDto(entity);
        dto.setRoleId(entity.getRole().getName());
        return dto;
    }

    @Override
    public void delete(Integer id) {
        userRepository.deleteById(id);
        handleImg.deleteAvatarAsync(true, id);
    }

    @Override
    public List<UserDetailDto> getAllUser() {
        List<User> users = userRepository.findAll();
        List<UserDetailDto> dtos = users.stream()
                .map(user -> transfer(user))
                .toList();
        return dtos;
    }

    @Override
    public UserDetailDto getUserById(Integer id) {
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return transfer(user);
    }

    private UserDetailDto transfer(User user) {
        UserDetailDto dto = new UserDetailDto();
        dto.setAvatar(user.getAvatar());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRoleId(user.getRole().getName());
        dto.setAddress(user.getAddress());
        dto.setPhone(user.getPhone());
        dto.setFullName(user.getFullName());
        return dto;
    }
}
