package com.haui.service;

import com.haui.dto.response.product.ProductDetailDto;
import com.haui.dto.response.user.UserDetailDto;
import com.haui.dto.response.user.UserDto;
import com.haui.dto.request.user.UserRequest;
import com.haui.dto.request.user.UserUpdateRequest;
import org.springframework.data.domain.Page;

import java.io.IOException;
import java.util.List;
import java.util.Optional;


public interface UserService {
    UserDto create(UserRequest request) throws IOException;
    UserDto update(Integer id, UserUpdateRequest request) throws IOException;
    void delete(Integer id);
    List<UserDetailDto> getAllUser();
    UserDetailDto getUserById(Integer id);

    Page<UserDetailDto> getAll(int page, int size, List<String> sort);

    Page<UserDetailDto> search(String keyword, int page, int size, List<String> sort);
}
