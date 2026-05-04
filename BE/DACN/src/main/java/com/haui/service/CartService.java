package com.haui.service;


import com.haui.dto.response.cart.CartDto;
import com.haui.dto.response.cart.product.CartItemDto;

import java.util.List;

public interface CartService {
    CartDto create(Integer userId);

    CartDto getByUserId(Integer userId);

    List<CartItemDto> getProducts(Integer cartId);

    void addProduct(Integer cartId, Integer productId, Integer quantity);

    void updateQuantity(Integer cartId, Integer productId, Integer quantity);

    void removeProduct(Integer cartId, Integer productId);

    void clear(Integer cartId);

    Boolean check(Integer cartId, Integer productId);

}
