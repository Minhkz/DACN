package com.haui.service;


import com.haui.dto.response.cart.CartDto;
import com.haui.dto.response.cart.product.CartItemDto;

import java.util.List;

public interface CartService {
    CartDto create(Integer userId);

    CartDto getByUserId(Integer userId);

    List<CartItemDto> getProducts(Integer userId);

    void addProduct(Integer userId, Integer productId, Integer quantity);

    void updateQuantity(Integer userId, Integer productId, Integer quantity);

    void removeProduct(Integer userId, Integer productId);

    void clear(Integer userId);

    Boolean check(Integer userId, Integer productId);

}
