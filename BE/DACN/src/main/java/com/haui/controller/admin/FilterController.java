package com.haui.controller.admin;

import com.haui.dto.request.filter.FilterRequest;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.filter.FilterDto;
import com.haui.service.FilterService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/filters")
@CrossOrigin(origins = "*", maxAge = 3600)
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class FilterController {
    FilterService filterService;

    @PostMapping
    public ResponseResult<FilterDto> filter(@RequestBody @Valid FilterRequest request) {
        return ResponseResult.success(filterService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseResult<FilterDto> update(@PathVariable Integer id, @RequestBody @Valid FilterRequest request) {
        return ResponseResult.success(filterService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseResult<String> delete(@PathVariable Integer id) {
        return ResponseResult.success("Successfully deleted filter");
    }

    @GetMapping
    public ResponseResult<List<FilterDto>> getAll() {
        return ResponseResult.success(filterService.getAllFilters());
    }

    @GetMapping("/{id}")
    public ResponseResult<FilterDto> detail(@PathVariable Integer id) {
        return ResponseResult.success(filterService.detail(id));
    }
}
