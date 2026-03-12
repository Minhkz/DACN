package com.haui.controller.admin;

import com.haui.dto.request.product.ProductRequest;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.product.ProductDetailDto;
import com.haui.dto.response.product.ProductDto;
import com.haui.service.ProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@CrossOrigin(origins = "*", maxAge = 3600)
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ProductController {
    ProductService productService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseResult<ProductDto> create(@ModelAttribute @Valid ProductRequest request) throws IOException {
        return ResponseResult.success(productService.create(request));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseResult<ProductDto> update(@PathVariable Integer id, @ModelAttribute @Valid ProductRequest request) throws IOException {
        return ResponseResult.success(productService.update(request, id));
    }

    @DeleteMapping("/{id}")
    public ResponseResult<String> delete(@PathVariable Integer id) {
        productService.delete(id);
        return ResponseResult.success("Successfully deleted product");
    }

    @GetMapping("/{id}")
    public ResponseResult<ProductDetailDto> detail(@PathVariable Integer id) {
        return ResponseResult.success(productService.detail(id));
    }

    @GetMapping
    public ResponseResult<List<ProductDetailDto>> getListProduct(){
        return null;
    }

}
