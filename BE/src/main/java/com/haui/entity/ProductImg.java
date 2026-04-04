package com.haui.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "product_img")
@Data
public class ProductImg {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String src;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}
