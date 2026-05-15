package com.haui.mapper;

import com.haui.dto.request.order.OrderRequest;
import com.haui.dto.response.order.OrderDto;
import com.haui.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Mapper(
        componentModel = "spring",
        uses = {ProductOrderMapper.class},
        imports = {LocalDateTime.class, BigDecimal.class}
)
public abstract class OrderMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)

    @Mapping(target = "status", constant = "PENDING")

    @Mapping(target = "totalPrice", expression = "java(BigDecimal.ZERO)")

    @Mapping(target = "paymentStatus", constant = "UNPAID")

    @Mapping(target = "paymentRef", constant = "UNKNOWN")

    @Mapping(target = "createdDate", expression = "java(LocalDateTime.now())")

    @Mapping(target = "productOrders", ignore = true)
    public abstract Order toCreate(OrderRequest request);


    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "username", source = "user.username")
    @Mapping(target = "items", source = "productOrders")
    public abstract OrderDto toDto(Order order);
}