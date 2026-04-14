package com.haui.controller.admin;

import com.haui.dto.request.filter.FilterRequest;
import com.haui.dto.response.PageResponse;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.filter.FilterDto;
import com.haui.service.FilterService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/filters")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class FilterController {
    FilterService filterService;

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseResult<FilterDto> filter(@RequestBody @Valid FilterRequest request) {
        return ResponseResult.success(filterService.create(request));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseResult<FilterDto> update(@PathVariable Integer id, @RequestBody @Valid FilterRequest request) {
        return ResponseResult.success(filterService.update(id, request));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseResult<String> delete(@PathVariable Integer id) {
        filterService.delete(id);
        return ResponseResult.success("Successfully deleted filter");
    }

    @GetMapping("/all")
    public ResponseResult<List<FilterDto>> getListFilter() {
        return ResponseResult.success(filterService.getAllFilters());
    }

    @GetMapping
    public ResponseResult<PageResponse<FilterDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) List<String> sort
    ){
        Page<FilterDto> result = filterService.getAll(page, size, sort);
        return ResponseResult.success(PageResponse.from(result));
    }

    @GetMapping("/{id}")
    public ResponseResult<FilterDto> detail(@PathVariable Integer id) {
        return ResponseResult.success(filterService.detail(id));
    }
}
