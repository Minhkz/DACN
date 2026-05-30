package com.haui.controller.client;

import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.product.ProductDetailDto;
import com.haui.middleware.annotation.TrackProductView;
import com.haui.service.ProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductTrackingController {
    ProductService productService;

    @GetMapping("/{id}/tracking")
    @TrackProductView
    public ResponseResult<ProductDetailDto> getById(@PathVariable Integer id) {
        return ResponseResult.success(productService.detail(id));
    }

}
