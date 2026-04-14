package com.haui.service;


import com.haui.dto.request.filter.FilterRequest;
import com.haui.dto.response.filter.FilterDto;
import com.haui.dto.response.product.ProductDetailDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface FilterService {
    FilterDto create(FilterRequest request);

    FilterDto update(Integer id, FilterRequest request);

    void delete(Integer id);

    List<FilterDto> getAllFilters();

    FilterDto detail(Integer id);

    Page<FilterDto> getAll(int page, int size, List<String> sort);
}
