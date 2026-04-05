package com.haui.mapper;

import com.haui.dto.response.user.UserDto;
import com.haui.dto.request.user.UserRequest;
import com.haui.dto.request.user.UserUpdateRequest;
import com.haui.entity.User;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class UserMapper implements EntityMapper<UserDto, User>{
    @Mapping(target = "id",  ignore = true)
    @Mapping(target = "avatar",  ignore = true)
    public abstract User toCreate(UserRequest request);

    @Mapping(target = "id",  ignore = true)
    @Mapping(target = "avatar",  ignore = true)
    @Mapping(target = "username",  ignore = true)
    @Mapping(target = "email",  ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract void partialUpdate(@MappingTarget User entity, UserUpdateRequest request);


}
