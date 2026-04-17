package com.haui.controller.admin;

import com.haui.dto.request.product.ProductRequest;
import com.haui.dto.request.product.ProductUpdateRequest;
import com.haui.dto.response.PageResponse;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.product.ProductDetailDto;
import com.haui.dto.response.product.ProductDto;
import com.haui.service.ProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ProductController {
    ProductService productService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseResult<ProductDto> create(@ModelAttribute @Valid ProductRequest request) throws IOException {
        return ResponseResult.success(productService.create(request));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseResult<ProductDto> update(@PathVariable Integer id, @ModelAttribute @Valid ProductUpdateRequest request) throws IOException {
        return ResponseResult.success(productService.update(request, id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseResult<String> delete(@PathVariable Integer id) {
        productService.delete(id);
        return ResponseResult.success("Successfully deleted product");
    }

    @GetMapping("/{id}")
    public ResponseResult<ProductDetailDto> detail(@PathVariable Integer id) {
        return ResponseResult.success(productService.detail(id));
    }

    @GetMapping("/all")
    public ResponseResult<List<ProductDetailDto>> getListProduct(){
        return ResponseResult.success(productService.getListProduct());
    }

    @GetMapping
    public ResponseResult<PageResponse<ProductDetailDto>> getAll(
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(required = false) List<String> sort
    ){
        Page<ProductDetailDto> result = productService.getAll(type, page, size, sort);
        return ResponseResult.success(PageResponse.from(result));
    }

    @GetMapping("/search")
    public ResponseResult<PageResponse<ProductDetailDto>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) List<String> sort
    ) {
        Page<ProductDetailDto> result = productService.search(keyword, page, size, sort);
        return ResponseResult.success(PageResponse.from(result));
    }

}
