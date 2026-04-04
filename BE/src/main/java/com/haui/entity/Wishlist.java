package com.haui.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "wishlists")
@Data
public class Wishlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
