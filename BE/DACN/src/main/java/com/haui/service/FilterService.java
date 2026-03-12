package com.haui.service;


import com.haui.dto.request.filter.FilterRequest;
import com.haui.dto.response.filter.FilterDto;

import java.util.List;

public interface FilterService {
    FilterDto create(FilterRequest request);

    FilterDto update(Integer id, FilterRequest request);

    void delete(Integer id);

    List<FilterDto> getAllFilters();

    FilterDto detail(Integer id);
}
