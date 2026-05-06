package com.haui.service.impl;

import com.haui.dto.response.cart.CartDto;
import com.haui.dto.response.cart.product.CartItemDto;
import com.haui.entity.Cart;
import com.haui.entity.Product;
import com.haui.entity.ProductCart;
import com.haui.entity.User;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.mapper.CartMapper;
import com.haui.mapper.CartProductMapper;
import com.haui.repository.CartRepository;
import com.haui.repository.ProductCartRepository;
import com.haui.repository.ProductRepository;
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
    CartProductMapper cartProductMapper;
    ProductRepository productRepository;
    ProductCartRepository productCartRepository;


    private Cart getCartByUserId(Integer userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CartDto create(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return cartRepository.findByUserId(userId)
                .map(cartMapper::toDto)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartMapper.toDto(cartRepository.save(cart));
                });
    }

    @Override
    public CartDto getByUserId(Integer userId) {
        return cartMapper.toDto(getCartByUserId(userId));
    }

    @Override
    @Transactional
    public List<CartItemDto> getProducts(Integer userId) {
        return cartProductMapper.toItemDtos(getCartByUserId(userId).getProductCart());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addProduct(Integer userId, Integer productId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new AppException(ErrorCode.INVALID_QUANTITY);
        }

        Cart cart = getCartByUserId(userId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        productCartRepository.findByCartIdAndProductId(cart.getId(), productId)
                .ifPresentOrElse(
                        existing -> {
                            existing.setQuantity(existing.getQuantity() + quantity);
                            productCartRepository.save(existing);
                        },
                        () -> {
                            ProductCart productCart = new ProductCart();
                            productCart.setCart(cart);
                            productCart.setProduct(product);
                            productCart.setQuantity(quantity);
                            productCartRepository.save(productCart);
                        }
                );
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateQuantity(Integer userId, Integer productId, Integer quantity) {
        Cart cart = getCartByUserId(userId);

        if (quantity == null || quantity <= 0) {
            productCartRepository.deleteByCartIdAndProductId(cart.getId(), productId);
            return;
        }

        ProductCart productCart = productCartRepository
                .findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        productCart.setQuantity(quantity);
        productCartRepository.save(productCart);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeProduct(Integer userId, Integer productId) {
        Cart cart = getCartByUserId(userId);
        productCartRepository.deleteByCartIdAndProductId(cart.getId(), productId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void clear(Integer userId) {
        Cart cart = getCartByUserId(userId);
        productCartRepository.deleteAllByCartId(cart.getId());
    }


}