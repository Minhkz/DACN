package com.haui.mapper;

import com.haui.dto.response.order.OrderItemDto;
import com.haui.entity.Order;
import com.haui.entity.Product;
import com.haui.entity.ProductOrder;
import com.haui.service.cloudinary.CloudinaryService;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public abstract class ProductOrderMapper {
    protected CloudinaryService cloudinaryService;


    @Mapping(target = "id", source = "id")

    @Mapping(target = "productId", source = "product.id")

    @Mapping(target = "productName", source = "product.name")

    @Mapping(target = "productAvatar", ignore = true)

    @Mapping(target = "product", source = "product")

    @Mapping(target = "price", source = "price")

    @Mapping(target = "quantity", source = "quantity")

    @Mapping(
            target = "subTotal",
            expression = "java(productOrder.getPrice()" +
                    ".multiply(java.math.BigDecimal.valueOf(productOrder.getQuantity())))"
    )
    public abstract OrderItemDto toDto(ProductOrder productOrder);


    @AfterMapping
    protected void mapAvatar(ProductOrder entity,
                             @MappingTarget OrderItemDto dto) {

        dto.setProductAvatar(
                cloudinaryService.getImageUrl(
                        entity.getProduct().getAvatar()
                )
        );
    }


    @Mapping(target = "id", ignore = true)

    @Mapping(target = "price",
            expression = "java(product.getPrice())")

    @Mapping(target = "quantity", ignore = true)

    @Mapping(target = "product",
            expression = "java(product)")

    @Mapping(target = "order",
            expression = "java(order)")

    public abstract ProductOrder toCreate(Product product, Order order);


    public abstract List<OrderItemDto> toDtoList(
            List<ProductOrder> productOrders
    );
}