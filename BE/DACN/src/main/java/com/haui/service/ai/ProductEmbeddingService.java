package com.haui.service.ai;

public interface ProductEmbeddingService {
    void indexProduct(Integer productId);

    void deleteProductVector(Integer productId);
}
