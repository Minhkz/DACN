package com.haui.dto.request.wishlist;
import lombok.Data;
public class WishlistRequest {

    private Integer userId;
    private Integer productId;

    public Integer getUserId() {
        return userId;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }
}