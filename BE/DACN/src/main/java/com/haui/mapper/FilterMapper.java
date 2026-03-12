package com.haui.mapper;

import com.haui.dto.request.filter.FilterRequest;
import com.haui.dto.response.filter.FilterDto;
import com.haui.entity.Filter;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public abstract class FilterMapper implements EntityMapper<FilterDto, Filter> {
    public abstract Filter toCreate(FilterRequest request);

    @Mapping(target = "id",  ignore = true)
    public abstract void partialUpdate(@MappingTarget Filter entity, FilterRequest request);
}
