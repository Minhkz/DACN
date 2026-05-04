package com.haui.mapper;

import com.haui.dto.response.cart.CartDto;
import com.haui.entity.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class CartMapper {
    @Mapping(target = "userId", source = "user.id")
    public abstract CartDto toDto(Cart cart);

}
