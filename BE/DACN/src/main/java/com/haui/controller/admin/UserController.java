package com.haui.controller.admin;

import com.haui.dto.response.PageResponse;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.product.ProductDetailDto;
import com.haui.dto.response.user.UserDetailDto;
import com.haui.dto.response.user.UserDto;
import com.haui.dto.request.user.UserRequest;
import com.haui.dto.request.user.UserUpdateRequest;
import com.haui.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class UserController {
    UserService userService;


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseResult<UserDto> create(@ModelAttribute @Valid UserRequest request) throws IOException {
        return ResponseResult.success(userService.create(request));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseResult<UserDto> update(@PathVariable Integer id, @ModelAttribute @Valid UserUpdateRequest request) throws IOException {
        return ResponseResult.success(userService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseResult<String> delete(@PathVariable Integer id) {
        userService.delete(id);
        return ResponseResult.success("Successfully deleted user");
    }

    @GetMapping("/all")
    public ResponseResult<List<UserDetailDto>> getListUser() {
        return ResponseResult.success(userService.getAllUser());
    }

    @GetMapping("/{id}")
    public ResponseResult<UserDetailDto> detail(@PathVariable Integer id) {
        return ResponseResult.success(userService.getUserById(id));
    }

    @GetMapping
    public ResponseResult<PageResponse<UserDetailDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) List<String> sort
    ){
        Page<UserDetailDto> result = userService.getAll(page, size, sort);
        return ResponseResult.success(PageResponse.from(result));
    }

    @GetMapping("/search")
    public ResponseResult<PageResponse<UserDetailDto>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) List<String> sort
    ) {
        Page<UserDetailDto> result = userService.search(keyword, page, size, sort);
        return ResponseResult.success(PageResponse.from(result));
    }
}
