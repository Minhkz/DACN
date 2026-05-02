package com.haui.mapper;

import com.haui.dto.response.wishlist.WishlistDto;
import com.haui.entity.Wishlist;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class WishlistMapper   implements EntityMapper<WishlistDto, Wishlist>
{
    @Mapping(target = "userId", source = "user.id")
    public abstract WishlistDto toDto(Wishlist entity);
}
