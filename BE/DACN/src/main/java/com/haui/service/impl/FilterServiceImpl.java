package com.haui.service.impl;

import com.haui.dto.request.filter.FilterRequest;
import com.haui.dto.response.filter.FilterDto;
import com.haui.entity.Filter;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.mapper.FilterMapper;
import com.haui.repository.FilterRepository;
import com.haui.service.FilterService;
import com.haui.utils.PageableUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.tomcat.util.descriptor.web.FilterMap;
import org.springframework.cache.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@CacheConfig(cacheNames = "filters")
public class FilterServiceImpl implements FilterService {
    FilterRepository filterRepository;
    FilterMapper filterMapper;

    private void validateLogic(FilterRequest request, Boolean isCreated){
        if(isCreated){
            if(filterRepository.existsByNameAndType(request.getName(), request.getType())){
                throw new AppException(ErrorCode.FILTER_ALREADY_EXISTS);
            }
        }else {
            if(filterRepository.existsByNameAndTypeAndIdNot(request.getName(), request.getType(), request.getId())){
                throw new AppException(ErrorCode.FILTER_ALREADY_EXISTS);
            }
        }
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(key = "'list'")
    public FilterDto create(FilterRequest request) {
        validateLogic(request,true);

        Filter entity = filterMapper.toCreate(request);
        filterRepository.save(entity);
        return filterMapper.toDto(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @Caching(
            put = @CachePut(key = "#id"),
            evict = @CacheEvict(key = "'list'")
    )
    public FilterDto update(Integer id, FilterRequest request) {
        request.setId(id);
        validateLogic(request,false);
        Filter entity = filterRepository.findById(id).orElseThrow(()->new AppException(ErrorCode.FILTER_NOT_FOUND));
        filterMapper.partialUpdate(entity, request);
        filterRepository.save(entity);
        return filterMapper.toDto(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(allEntries = true)
    public void delete(Integer id) {
        Filter entity =  filterRepository.findById(id).orElseThrow(()->new AppException(ErrorCode.FILTER_NOT_FOUND));
        filterRepository.delete(entity);
    }

    @Override
    @Cacheable(key="'list'")
    public List<FilterDto> getAllFilters() {
        return filterMapper.toDto(filterRepository.findAll());
    }

    @Override
    @Cacheable(key = "#id")
    public FilterDto detail(Integer id) {
        Filter entity = filterRepository.findById(id).orElseThrow(()->new AppException(ErrorCode.FILTER_NOT_FOUND));
        return filterMapper.toDto(entity);
    }

    @Override
    public Page<FilterDto> getAll(int page, int size, List<String> sort) {
        Pageable pageable = PageableUtil.buildPageable(page, size, sort);

        Page<Filter> filterPage = filterRepository.findAll(pageable);
        List<Filter>  filters = filterPage.getContent();

        if (filters.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, filterPage.getTotalElements());
        }
        return new PageImpl<>(filterMapper.toDto(filters), pageable, filterPage.getTotalElements());
    }


}
