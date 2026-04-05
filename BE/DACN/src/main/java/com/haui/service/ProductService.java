package com.haui.service;

import com.haui.dto.request.product.ProductRequest;
import com.haui.dto.response.product.ProductDetailDto;
import com.haui.dto.response.product.ProductDto;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    ProductDto create(ProductRequest request) throws IOException;

    ProductDto update(ProductRequest request, Integer id) throws IOException;

    void delete(Integer id);

    ProductDetailDto detail(Integer id);

    List<ProductDetailDto> getListProduct();
}
