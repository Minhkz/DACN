package com.haui.service.impl;

import com.haui.dto.request.cart.CartItemRequest;
import com.haui.dto.request.cart.CartRequest;
import com.haui.dto.response.cart.CartDto;
import com.haui.dto.response.cart.CartItemDto;
import com.haui.dto.response.product.ProductDetailDto;
import com.haui.entity.Cart;
import com.haui.entity.Product;
import com.haui.entity.ProductCart;
import com.haui.entity.ProductFilter;
import com.haui.entity.ProductImg;
import com.haui.entity.User;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.repository.CartRepository;
import com.haui.repository.ProductCartRepository;
import com.haui.repository.ProductFilterRepository;
import com.haui.repository.ProductImgRepository;
import com.haui.repository.ProductRepository;
import com.haui.repository.UserRepository;
import com.haui.service.CartService;
import com.haui.service.cloudinary.CloudinaryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartServiceImpl implements CartService {
    CartRepository cartRepository;
    ProductCartRepository productCartRepository;
    UserRepository userRepository;
    ProductRepository productRepository;
    ProductImgRepository productImgRepository;
    ProductFilterRepository productFilterRepository;
    CloudinaryService cloudinaryService;

    @Override
    @Transactional
    public CartDto create(CartRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (cartRepository.existsByUserId(request.getUserId())) {
            throw new AppException(ErrorCode.CART_ALREADY_EXISTS);
        }

        Cart cart = new Cart();
        cart.setUser(user);
        return toDto(cartRepository.save(cart));
    }

    @Override
    public List<CartDto> getAll() {
        return cartRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public CartDto getById(Integer id) {
        Cart cart = getCart(id);
        return toDto(cart);
    }

    @Override
    public CartDto getByUserId(Integer userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));
        return toDto(cart);
    }

    @Override
    @Transactional
    public CartDto addItem(Integer cartId, CartItemRequest request) {
        Cart cart = getCart(cartId);
        Product product = getProduct(request.getProductId());
        validateProductQuantity(product, request.getQuantity());

        ProductCart productCart = productCartRepository.findByCartIdAndProductId(cartId, request.getProductId())
                .orElseGet(ProductCart::new);

        int newQuantity = request.getQuantity();
        if (productCart.getId() != null) {
            newQuantity = productCart.getQuantity() + request.getQuantity();
        }
        validateProductQuantity(product, newQuantity);

        productCart.setCart(cart);
        productCart.setProduct(product);
        productCart.setQuantity(newQuantity);
        productCart.setPrice(product.getPrice());
        productCartRepository.save(productCart);
        return toDto(cart);
    }

    @Override
    @Transactional
    public CartDto updateItem(Integer cartId, Integer itemId, CartItemRequest request) {
        Cart cart = getCart(cartId);
        ProductCart item = productCartRepository.findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new AppException(ErrorCode.CART_ITEM_NOT_FOUND);
        }

        Product product = getProduct(request.getProductId());
        validateProductQuantity(product, request.getQuantity());

        item.setProduct(product);
        item.setPrice(product.getPrice());
        item.setQuantity(request.getQuantity());
        productCartRepository.save(item);
        return toDto(cart);
    }

    @Override
    @Transactional
    public CartDto removeItem(Integer cartId, Integer itemId) {
        Cart cart = getCart(cartId);
        ProductCart item = productCartRepository.findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new AppException(ErrorCode.CART_ITEM_NOT_FOUND);
        }

        productCartRepository.delete(item);
        return toDto(cart);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Cart cart = getCart(id);
        productCartRepository.deleteByCartId(id);
        cartRepository.delete(cart);
    }

    private Cart getCart(Integer id) {
        return cartRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));
    }

    private Product getProduct(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    private void validateProductQuantity(Product product, Integer quantity) {
        if (quantity == null || quantity <= 0 || product.getQuantity() == null || product.getQuantity() < quantity) {
            throw new AppException(ErrorCode.PRODUCT_OUT_OF_STOCK);
        }
    }

    private ProductDetailDto toProductDetailDto(Product product) {
        List<ProductImg> images = productImgRepository.findByProductId(product.getId());
        List<ProductFilter> filters = productFilterRepository.findByProductId(product.getId());

        ProductDetailDto dto = new ProductDetailDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setSold(product.getSold());
        dto.setView(product.getView());
        dto.setAvatar(cloudinaryService.getImageUrl(product.getAvatar()));
        dto.setImgs(images.stream().map(ProductImg::getSrc).map(cloudinaryService::getImageUrl).toList());
        dto.setFilters(filters.stream().map(f -> f.getFilter().getName()).toList());
        return dto;
    }

    private CartDto toDto(Cart cart) {
        List<ProductCart> items = productCartRepository.findByCartId(cart.getId());

        List<CartItemDto> itemDtos = items.stream().map(item -> {
            CartItemDto dto = new CartItemDto();
            dto.setId(item.getId());
            dto.setProductId(item.getProduct().getId());
            dto.setProductName(item.getProduct().getName());
            dto.setProductAvatar(cloudinaryService.getImageUrl(item.getProduct().getAvatar()));
            dto.setPrice(item.getPrice());
            dto.setQuantity(item.getQuantity());
            dto.setProduct(toProductDetailDto(item.getProduct()));
            dto.setSubTotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            return dto;
        }).toList();

        BigDecimal totalPrice = itemDtos.stream()
                .map(CartItemDto::getSubTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        CartDto dto = new CartDto();
        dto.setId(cart.getId());
        dto.setUserId(cart.getUser().getId());
        dto.setUsername(cart.getUser().getUsername());
        dto.setItems(itemDtos);
        dto.setTotalPrice(totalPrice);
        return dto;
    }
}
