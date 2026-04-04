package com.haui.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "filters")
@Data
public class Filter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String type;
}
