package com.haui.service;

import com.haui.dto.request.product.ProductRequest;
import com.haui.dto.request.product.ProductUpdateRequest;
import com.haui.dto.response.product.ProductDetailDto;
import com.haui.dto.response.product.ProductDto;
import org.springframework.data.domain.Page;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    ProductDto create(ProductRequest request) throws IOException;

    ProductDto update(ProductUpdateRequest request, Integer id) throws IOException;

    void delete(Integer id);

    ProductDetailDto detail(Integer id);

    List<ProductDetailDto> getListProduct();

    Page<ProductDetailDto> getAll(String type, int page, int size, List<String> sort);

    Page<ProductDetailDto> search(String keyword, int page, int size, List<String> sort);
}
