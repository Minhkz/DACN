package com.haui.dto.response.wishlist;

import java.math.BigDecimal;

public class WishlistDto {

    private Integer id;
    private Integer productId;
    private String productName;
    private BigDecimal price;

    public Integer getId() {
        return id;
    }

    public Integer getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}