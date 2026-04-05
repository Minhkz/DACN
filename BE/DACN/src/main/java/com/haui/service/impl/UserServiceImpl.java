package com.haui.service.impl;

import com.haui.dto.response.user.UserDetailDto;
import com.haui.dto.response.user.UserDto;
import com.haui.dto.request.user.UserRequest;
import com.haui.dto.request.user.UserUpdateRequest;
import com.haui.dto.thread.user.DeleteUserAvatarEvent;
import com.haui.dto.thread.user.UpdateUserAvatarEvent;
import com.haui.dto.thread.user.UploadUserAvatarEvent;
import com.haui.entity.Role;
import com.haui.entity.User;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.mapper.UserMapper;
import com.haui.repository.RoleRepository;
import com.haui.repository.UserRepository;
import com.haui.service.UserService;
import com.haui.service.cloudinary.CloudinaryService;
import com.haui.service.cloudinary.user.HandleUserImg;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.cache.annotation.*;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@CacheConfig(cacheNames = "users")
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    UserMapper userMapper;
    RoleRepository roleRepository;
    CloudinaryService cloudinaryService;
    ApplicationEventPublisher eventPublisher;

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
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(key = "'list'")
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

            eventPublisher.publishEvent(
                    new UploadUserAvatarEvent(fileBytes, entity.getId())
            );
        }
        UserDto dto = userMapper.toDto(entity);
        dto.setRoleId(role.getName());
        return dto;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(key = "'list'")
    public UserDto update(Integer id, UserUpdateRequest request) throws IOException {
        request.setId(id);
        validateLogic(request);

        User entity = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        userMapper.partialUpdate(entity, request);
        userRepository.save(entity);

        MultipartFile file = request.getAvatar();
        if (file != null && !file.isEmpty()) {
            byte[] fileBytes = file.getBytes();

            eventPublisher.publishEvent(
                    new UpdateUserAvatarEvent(fileBytes, entity.getId())
            );
        }
        UserDto dto = userMapper.toDto(entity);
        dto.setRoleId(entity.getRole().getName());
        return dto;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(allEntries = true)
    public void delete(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        userRepository.delete(user);
        eventPublisher.publishEvent(new DeleteUserAvatarEvent(user.getAvatar()));
    }

    @Override
    @Cacheable(key="'list'")
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
        String img= cloudinaryService.getImageUrl(user.getAvatar());

        UserDetailDto dto = new UserDetailDto();
        dto.setId(user.getId());
        dto.setAvatar(img);
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRoleId(user.getRole().getName());
        dto.setAddress(user.getAddress());
        dto.setPhone(user.getPhone());
        dto.setFullName(user.getFullName());
        return dto;
    }
}
