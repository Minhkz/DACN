package com.haui.service.impl;


import com.haui.dto.response.cart.CartDto;
import com.haui.dto.response.cart.product.CartItemDto;
import com.haui.entity.Cart;
import com.haui.entity.User;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.mapper.CartMapper;
import com.haui.repository.CartRepository;
import com.haui.repository.UserRepository;
import com.haui.service.CartService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartServiceImpl implements CartService {
    CartRepository cartRepository;
    UserRepository userRepository;
    CartMapper cartMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CartDto create(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
        Cart entity = new Cart();
        entity.setUser(user);
        cartRepository.save(entity);
        return cartMapper.toDto(entity);
    }

    @Override
    public CartDto getByUserId(Integer userId) {
        return null;
    }

    @Override
    public List<CartItemDto> getProducts(Integer cartId) {
        return List.of();
    }

    @Override
    public void addProduct(Integer cartId, Integer productId, Integer quantity) {

    }

    @Override
    public void updateQuantity(Integer cartId, Integer productId, Integer quantity) {

    }

    @Override
    public void removeProduct(Integer cartId, Integer productId) {

    }

    @Override
    public void clear(Integer cartId) {

    }

    @Override
    public Boolean check(Integer cartId, Integer productId) {
        return null;
    }
}
