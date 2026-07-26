package com.haui.service.ai.impl;

import com.haui.entity.Product;
import com.haui.entity.ProductVector;
import com.haui.repository.ProductRepository;
import com.haui.repository.ProductVectorRepository;
import com.haui.service.ai.ProductEmbeddingService;
import com.haui.utils.VectorUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(
        name = "app.ai.enabled",
        havingValue = "true"
)
public class ProductEmbeddingServiceImpl implements ProductEmbeddingService {

    private final ProductRepository productRepository;
    private final ProductVectorRepository productVectorRepository;
    private final EmbeddingModel embeddingModel;

    @Override
    @Transactional
    public void indexProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow();

        String content = """
            Tên sản phẩm: %s
            Giá: %s
            Mô tả: %s
            Số lượng còn: %s
            Đã bán: %s
        """.formatted(
                product.getName(),
                product.getPrice(),
                product.getDescription(),
                product.getQuantity(),
                product.getSold()
        );

        float[] embedding = embeddingModel.embed(content);
        String embeddingJson = VectorUtil.toJsonArray(embedding);

        ProductVector productVector = productVectorRepository
                .findByProductId(productId)
                .orElse(ProductVector.builder()
                        .product(product)
                        .build());

        productVector.setContent(content);
        productVector.setEmbeddingJson(embeddingJson);

        productVectorRepository.save(productVector);
    }

    @Override
    @Transactional
    public void deleteProductVector(Integer productId) {
        productVectorRepository.deleteByProductId(productId);
    }
}