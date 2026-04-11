package com.haui.service;

import com.haui.dto.request.cart.CartItemRequest;
import com.haui.dto.request.cart.CartRequest;
import com.haui.dto.response.cart.CartDto;

import java.util.List;

public interface CartService {
    CartDto create(CartRequest request);
    List<CartDto> getAll();
    CartDto getById(Integer id);
    CartDto getByUserId(Integer userId);
    CartDto addItem(Integer cartId, CartItemRequest request);
    CartDto updateItem(Integer cartId, Integer itemId, CartItemRequest request);
    CartDto removeItem(Integer cartId, Integer itemId);
    void delete(Integer id);
}
