package com.haui.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "products_filters")
@Data
public class ProductFilter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "filter_id")
    private Filter filter;
}
