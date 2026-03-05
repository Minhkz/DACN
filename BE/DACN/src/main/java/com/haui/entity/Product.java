package com.haui.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @Column(name = "des")
    private String description;

    private BigDecimal price;
    private Integer quantity;
    private Integer sold;
    private String avatar;
}
