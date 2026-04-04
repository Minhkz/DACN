package com.haui.repository;

import com.haui.entity.Filter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilterRepository extends JpaRepository<Filter, Integer> {
    Boolean existsByNameAndType(String name, String type);
    Boolean existsByNameAndTypeAndIdNot(String name, String type, Integer id);


}
