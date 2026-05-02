package com.haui.mapper;

import com.haui.dto.response.wishlist.product.WishlistProductDto;
import com.haui.dto.response.wishlist.product.WishlistItemDto;
import com.haui.entity.ProductWishlist;
import com.haui.entity.Wishlist;
import com.haui.service.cloudinary.CloudinaryService;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class WishlistProductMapper {

    @Autowired
    protected CloudinaryService cloudinaryService;

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "price", source = "product.price")
    @Mapping(target = "avatar", ignore = true)
    public abstract WishlistItemDto toItemDto(ProductWishlist entity);

    @AfterMapping
    protected void mapAvatar(ProductWishlist entity,
                             @MappingTarget WishlistItemDto dto) {

        dto.setAvatar(
                cloudinaryService.getImageUrl(entity.getProduct().getAvatar())
        );
    }

    public abstract List<WishlistItemDto> toItemDtos(List<ProductWishlist> items);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "items", ignore = true)
    public abstract WishlistProductDto toDto(Wishlist entity);


}
