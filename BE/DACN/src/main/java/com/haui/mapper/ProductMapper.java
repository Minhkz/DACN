package com.haui.mapper;

import com.haui.dto.request.product.ProductRequest;
import com.haui.dto.request.product.ProductUpdateRequest;
import com.haui.dto.response.product.ProductDto;
import com.haui.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public abstract class ProductMapper implements EntityMapper<ProductDto, Product> {

    @Mapping(target = "id",  ignore = true)
    @Mapping(target = "avatar",  ignore = true)
    public abstract Product toCreate(ProductRequest request);

    @Mapping(target = "id",  ignore = true)
    @Mapping(target = "avatar",  ignore = true)
    public abstract void partialUpdate(@MappingTarget Product product, ProductUpdateRequest request);

}
