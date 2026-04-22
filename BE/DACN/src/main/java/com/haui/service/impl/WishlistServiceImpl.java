package com.haui.service.impl;

import com.haui.dto.request.wishlist.WishlistItemRequest;
import com.haui.dto.request.wishlist.WishlistRequest;
import com.haui.dto.response.product.ProductDetailDto;
import com.haui.dto.response.wishlist.WishlistDto;
import com.haui.dto.response.wishlist.WishlistItemDto;
import com.haui.entity.Product;
import com.haui.entity.ProductFilter;
import com.haui.entity.ProductImg;
import com.haui.entity.ProductWishlist;
import com.haui.entity.User;
import com.haui.entity.Wishlist;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.repository.ProductFilterRepository;
import com.haui.repository.ProductImgRepository;
import com.haui.repository.ProductRepository;
import com.haui.repository.ProductWishlistRepository;
import com.haui.repository.UserRepository;
import com.haui.repository.WishlistRepository;
import com.haui.service.WishlistService;
import com.haui.service.cloudinary.CloudinaryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WishlistServiceImpl implements WishlistService {
    WishlistRepository wishlistRepository;
    ProductWishlistRepository productWishlistRepository;
    UserRepository userRepository;
    ProductRepository productRepository;
    ProductImgRepository productImgRepository;
    ProductFilterRepository productFilterRepository;
    CloudinaryService cloudinaryService;

    @Override
    @Transactional
    public WishlistDto create(WishlistRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (wishlistRepository.existsByUserId(request.getUserId())) {
            throw new AppException(ErrorCode.WISHLIST_ALREADY_EXISTS);
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        return toDto(wishlistRepository.save(wishlist));
    }

    @Override
    public List<WishlistDto> getAll() {
        return wishlistRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public WishlistDto getById(Integer id) {
        return toDto(getWishlist(id));
    }

    @Override
    public WishlistDto getByUserId(Integer userId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.WISHLIST_NOT_FOUND));
        return toDto(wishlist);
    }

    @Override
    @Transactional
    public WishlistDto addItem(Integer wishlistId, WishlistItemRequest request) {
        Wishlist wishlist = getWishlist(wishlistId);
        Product product = getProduct(request.getProductId());

        if (productWishlistRepository.existsByWishlistIdAndProductId(wishlistId, request.getProductId())) {
            throw new AppException(ErrorCode.WISHLIST_ITEM_ALREADY_EXISTS);
        }

        ProductWishlist item = new ProductWishlist();
        item.setWishlist(wishlist);
        item.setProduct(product);
        productWishlistRepository.save(item);
        return toDto(wishlist);
    }

    @Override
    @Transactional
    public WishlistDto removeItem(Integer wishlistId, Integer itemId) {
        Wishlist wishlist = getWishlist(wishlistId);
        ProductWishlist item = productWishlistRepository.findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.WISHLIST_ITEM_NOT_FOUND));

        if (!item.getWishlist().getId().equals(wishlist.getId())) {
            throw new AppException(ErrorCode.WISHLIST_ITEM_NOT_FOUND);
        }

        productWishlistRepository.delete(item);
        return toDto(wishlist);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Wishlist wishlist = getWishlist(id);
        productWishlistRepository.deleteByWishlistId(id);
        wishlistRepository.delete(wishlist);
    }

    private Wishlist getWishlist(Integer id) {
        return wishlistRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WISHLIST_NOT_FOUND));
    }

    private Product getProduct(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
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

    private WishlistDto toDto(Wishlist wishlist) {
        List<ProductWishlist> items = productWishlistRepository.findByWishlistId(wishlist.getId());
        List<WishlistItemDto> itemDtos = items.stream().map(item -> {
            WishlistItemDto dto = new WishlistItemDto();
            dto.setId(item.getId());
            dto.setProductId(item.getProduct().getId());
            dto.setProductName(item.getProduct().getName());
            dto.setProductAvatar(cloudinaryService.getImageUrl(item.getProduct().getAvatar()));
            dto.setPrice(item.getProduct().getPrice());
            dto.setProduct(toProductDetailDto(item.getProduct()));
            return dto;
        }).toList();

        WishlistDto dto = new WishlistDto();
        dto.setId(wishlist.getId());
        dto.setUserId(wishlist.getUser().getId());
        dto.setUsername(wishlist.getUser().getUsername());
        dto.setCreatedDate(wishlist.getCreatedDate());
        dto.setTotalItems(itemDtos.size());
        dto.setItems(itemDtos);
        return dto;
    }
}
