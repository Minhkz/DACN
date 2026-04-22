package com.haui.service.impl;

import com.haui.dto.request.product.ProductRequest;
import com.haui.dto.request.product.ProductUpdateRequest;
import com.haui.dto.request.product.filter.ProductFilterRequest;
import com.haui.dto.response.product.ProductDetailDto;
import com.haui.dto.response.product.ProductDto;
import com.haui.dto.thread.product.DeleteProductAvatarEvent;
import com.haui.dto.thread.product.UpdateProductAvatarEvent;
import com.haui.dto.thread.product.UploadProductAvatarEvent;
import com.haui.dto.thread.productImg.DeleteProductImagesAvatarEvent;
import com.haui.dto.thread.productImg.UpdateProductImagesEvent;
import com.haui.dto.thread.productImg.UploadProductImagesEvent;
import com.haui.dto.thread.user.UpdateUserAvatarEvent;
import com.haui.dto.thread.user.UploadUserAvatarEvent;
import com.haui.entity.Filter;
import com.haui.entity.Product;
import com.haui.entity.ProductFilter;
import com.haui.entity.ProductImg;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.mapper.ProductMapper;
import com.haui.repository.FilterRepository;
import com.haui.repository.ProductFilterRepository;
import com.haui.repository.ProductImgRepository;
import com.haui.repository.ProductRepository;
import com.haui.service.ProductService;
import com.haui.service.cloudinary.CloudinaryService;
import com.haui.utils.PageableUtil;
import com.haui.utils.SpecificationUtil;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.cache.annotation.*;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;


@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@CacheConfig(cacheNames = "products")
public class ProductServiceImpl implements ProductService {
    ProductRepository productRepository;
    FilterRepository filterRepository;
    ProductImgRepository productImgRepository;
    ProductFilterRepository productFilterRepository;
    ProductMapper productMapper;
    ApplicationEventPublisher eventPublisher;
    CloudinaryService cloudinaryService;
    private void validateLogic(ProductRequest request, Boolean isCreated){
        if(isCreated){
            if(productRepository.existsByName(request.getName())){
                throw new AppException(ErrorCode.PRODUCT_ALREADY_EXISTS);
            }
        }
        validateFilters(request);
    }

    private void validateLogicUpdate(ProductUpdateRequest request, Boolean isUpdated){
        if(isUpdated){
            if(productRepository.existsByNameAndIdNot(request.getName(), request.getId())){
                throw new AppException(ErrorCode.PRODUCT_ALREADY_EXISTS);
            }
        }
    }


    private void validateFilters(ProductRequest request){
        List<Filter> filters = filterRepository.findAllById(request.getFilters());

        if(filters.size() != request.getFilters().size()){
            throw new AppException(ErrorCode.PRODUCT_FILTER_NOT_FOUND);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(key = "'list'")
    public ProductDto create(ProductRequest request) throws IOException {

        validateLogic(request, true);

        Product entity = productMapper.toCreate(request);


        productRepository.save(entity);

        // save filters
        if (request.getFilters() != null && !request.getFilters().isEmpty()) {

            List<Filter> filters = filterRepository.findAllById(request.getFilters());

            if (filters.size() != request.getFilters().size()) {
                throw new AppException(ErrorCode.PRODUCT_FILTER_NOT_FOUND);
            }

            List<ProductFilter> productFilters = new ArrayList<>();

            for (Filter filter : filters) {

                ProductFilter pf = new ProductFilter();
                pf.setProduct(entity);
                pf.setFilter(filter);

                productFilters.add(pf);
            }

            productFilterRepository.saveAll(productFilters);
        }

        // upload avatar
        MultipartFile file = request.getAvatar();
        if (file != null && !file.isEmpty()) {

            eventPublisher.publishEvent(
                    new UploadProductAvatarEvent(
                            file.getBytes(),
                            entity.getId()
                    )
            );
        }

        // upload images
        if (request.getImages() != null && !request.getImages().isEmpty()) {

            List<byte[]> imageBytes = new ArrayList<>();

            for (MultipartFile img : request.getImages()) {
                imageBytes.add(img.getBytes());
            }

            eventPublisher.publishEvent(
                    new UploadProductImagesEvent(
                            imageBytes,
                            entity.getId()
                    )
            );
        }

        return productMapper.toDto(entity);
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    @Caching(
            evict = @CacheEvict(key = "'list'")
    )
    public ProductDto update(ProductUpdateRequest request, Integer id) throws IOException {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        request.setId(id);

        validateLogicUpdate(request, true);

        productMapper.partialUpdate(product, request);

        productRepository.save(product);


        // update avatar
        if (request.getAvatar() != null) {
            MultipartFile avatar = request.getAvatar();
            if (avatar != null && !avatar.isEmpty()) {

                eventPublisher.publishEvent(
                        new UpdateProductAvatarEvent(
                                avatar.getBytes(),
                                id,
                                product.getAvatar()
                        )
                );
            }
        }


        // update images
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            List<String> oldPublicIds = productImgRepository.findByProductId(id).stream()
                    .map(ProductImg::getSrc)
                    .toList();
            productImgRepository.deleteByProductId(id);

            if (request.getImages() != null && !request.getImages().isEmpty()) {

                List<byte[]> imageBytes = new ArrayList<>();

                for (MultipartFile img : request.getImages()) {
                    imageBytes.add(img.getBytes());
                }

                eventPublisher.publishEvent(
                        new UpdateProductImagesEvent(
                                imageBytes,
                                id,
                                oldPublicIds
                        )
                );
            }
        }



        return productMapper.toDto(product);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(allEntries = true)
    public void delete(Integer id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // lấy images trước khi delete
        List<ProductImg> images = productImgRepository.findByProductId(id);

        List<String> publicIds = images.stream()
                .map(ProductImg::getSrc)
                .toList();

        productFilterRepository.deleteByProductId(id);
        productImgRepository.deleteByProductId(id);
        productRepository.delete(product);

        eventPublisher.publishEvent(
                new DeleteProductAvatarEvent(product.getAvatar())
        );

        eventPublisher.publishEvent(
                new DeleteProductImagesAvatarEvent(publicIds)
        );
    }

    @Override
    public ProductDetailDto detail(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        List<ProductImg> images = productImgRepository.findByProductId(id);
        List<ProductFilter> filters = productFilterRepository.findByProductId(id);

        return convert(product, images, filters);
    }

    @Override
    @Cacheable(key = "'list'")
    public List<ProductDetailDto> getListProduct() {
        List<Product> products = productRepository.findAll();

        List<Integer> ids = products.stream()
                .map(Product::getId)
                .toList();

        List<ProductImg> images = productImgRepository.findByProductIdIn(ids);
        List<ProductFilter> filters = productFilterRepository.findByProductIdIn(ids);

        Map<Integer, List<ProductImg>> imageMap = images.stream()
                .collect(Collectors.groupingBy(img -> img.getProduct().getId()));

        Map<Integer, List<ProductFilter>> filterMap = filters.stream()
                .collect(Collectors.groupingBy(filter -> filter.getProduct().getId()));

        return products.stream()
                .map(product -> convert(
                        product,
                        imageMap.getOrDefault(product.getId(), List.of()),
                        filterMap.getOrDefault(product.getId(), List.of())
                ))
                .toList();
    }

    @Override
    public Page<ProductDetailDto> getAll(String type, int page, int size, List<String> sort) {
        Pageable pageable = PageableUtil.buildPageable(page, size, sort);

        String normalizedType = normalizeType(type);

        Page<Product> productPage = (normalizedType == null || normalizedType.isBlank())
                ? productRepository.findAll(pageable)
                : productRepository.findAllByType(normalizedType, pageable);

        List<Product> products = productPage.getContent();

        if (products.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, productPage.getTotalElements());
        }

        List<Integer> ids = products.stream()
                .map(Product::getId)
                .toList();

        List<ProductImg> images = productImgRepository.findByProductIdIn(ids);
        List<ProductFilter> filters = productFilterRepository.findByProductIdIn(ids);

        Map<Integer, List<ProductImg>> imageMap = images.stream()
                .collect(Collectors.groupingBy(img -> img.getProduct().getId()));

        Map<Integer, List<ProductFilter>> filterMap = filters.stream()
                .collect(Collectors.groupingBy(filter -> filter.getProduct().getId()));

        List<ProductDetailDto> dtoList = products.stream()
                .map(product -> convert(
                        product,
                        imageMap.getOrDefault(product.getId(), Collections.emptyList()),
                        filterMap.getOrDefault(product.getId(), Collections.emptyList())
                ))
                .toList();

        return new PageImpl<>(dtoList, pageable, productPage.getTotalElements());
    }

    private String normalizeType(String type) {
        if (type == null || type.isBlank()) return null;

        return switch (type.trim().toLowerCase()) {
            case "laptop" -> "Laptop";
            case "desktop" -> "Desktop";
            case "monitor" -> "Monitor";
            case "custom-build" -> "Custom Build";
            default -> type.trim();
        };
    }

    @Override
    public Page<ProductDetailDto> search(String keyword, int page, int size, List<String> sort) {
        Pageable pageable = PageableUtil.buildPageable(page, size, sort);

        Map<String, String> keywordFields = new HashMap<>();
        if (keyword != null && !keyword.trim().isEmpty()) {
            keywordFields.put("name", keyword);
            keywordFields.put("description", keyword);
        }

        Specification<Product> spec = Specification
                .where(SpecificationUtil.<Product>alwaysTrue())
                .and(SpecificationUtil.orLikeIgnoreCase(keywordFields));

        Page<Product> productPage = productRepository.findAll(spec, pageable);
        List<Product> products = productPage.getContent();

        if (products.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, productPage.getTotalElements());
        }

        List<Integer> ids = products.stream()
                .map(Product::getId)
                .toList();

        List<ProductImg> images = productImgRepository.findByProductIdIn(ids);
        List<ProductFilter> filters = productFilterRepository.findByProductIdIn(ids);

        Map<Integer, List<ProductImg>> imageMap = images.stream()
                .collect(Collectors.groupingBy(img -> img.getProduct().getId()));

        Map<Integer, List<ProductFilter>> filterMap = filters.stream()
                .collect(Collectors.groupingBy(filter -> filter.getProduct().getId()));

        List<ProductDetailDto> dtoList = products.stream()
                .map(product -> convert(
                        product,
                        imageMap.getOrDefault(product.getId(), Collections.emptyList()),
                        filterMap.getOrDefault(product.getId(), Collections.emptyList())
                ))
                .toList();

        return new PageImpl<>(dtoList, pageable, productPage.getTotalElements());
    }

    @Override
    public Page<ProductDetailDto> filterProducts(ProductFilterRequest request) {
        int page = request.getPage() != null ? request.getPage() : 0;
        int size = request.getSize() != null ? request.getSize() : 5;

        Pageable pageable = PageRequest.of(page, size, resolveSort(request.getSort()));

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Lọc giá
            if (request.getPrice() != null) {
                if (request.getPrice().getMin() != null) {
                    predicates.add(
                            cb.greaterThanOrEqualTo(root.get("price"), request.getPrice().getMin())
                    );
                }

                if (request.getPrice().getMax() != null) {
                    predicates.add(
                            cb.lessThanOrEqualTo(root.get("price"), request.getPrice().getMax())
                    );
                }
            }


            if (request.getFilters() != null && !request.getFilters().isEmpty()) {
                for (Map.Entry<String, List<Integer>> entry : request.getFilters().entrySet()) {
                    String type = entry.getKey();
                    List<Integer> filterIds = entry.getValue();

                    if (filterIds == null || filterIds.isEmpty()) {
                        continue;
                    }

                    Subquery<Integer> subquery = query.subquery(Integer.class);
                    Root<ProductFilter> pfRoot = subquery.from(ProductFilter.class);
                    Join<ProductFilter, Filter> filterJoin = pfRoot.join("filter");

                    subquery.select(pfRoot.get("product").get("id"))
                            .where(
                                    cb.equal(pfRoot.get("product").get("id"), root.get("id")),
                                    cb.equal(filterJoin.get("type"), type),
                                    filterJoin.get("id").in(filterIds)
                            );

                    predicates.add(cb.exists(subquery));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Product> productPage = productRepository.findAll(spec, pageable);
        List<Product> products = productPage.getContent();

        if (products.isEmpty()) {
            return new PageImpl<>(
                    Collections.emptyList(),
                    pageable,
                    productPage.getTotalElements()
            );
        }

        List<Integer> ids = products.stream()
                .map(Product::getId)
                .toList();

        List<ProductImg> images = productImgRepository.findByProductIdIn(ids);
        List<ProductFilter> filters = productFilterRepository.findByProductIdIn(ids);

        Map<Integer, List<ProductImg>> imageMap = images.stream()
                .collect(Collectors.groupingBy(img -> img.getProduct().getId()));

        Map<Integer, List<ProductFilter>> filterMap = filters.stream()
                .collect(Collectors.groupingBy(filter -> filter.getProduct().getId()));

        List<ProductDetailDto> dtoList = products.stream()
                .map(product -> convert(
                        product,
                        imageMap.getOrDefault(product.getId(), Collections.emptyList()),
                        filterMap.getOrDefault(product.getId(), Collections.emptyList())
                ))
                .toList();

        return new PageImpl<>(
                dtoList,
                pageable,
                productPage.getTotalElements()
        );
    }


    private ProductDetailDto convert(Product product, List<ProductImg> images, List<ProductFilter> filters) {
        ProductDetailDto dto = new ProductDetailDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setView(product.getView());
        dto.setSold(product.getSold());
        dto.setAvatar(cloudinaryService.getImageUrl(product.getAvatar()));
        dto.setImgs(images.stream().map(ProductImg::getSrc).map(cloudinaryService::getImageUrl).toList());
        dto.setFilters(filters.stream().map(f -> f.getFilter().getName()).toList());
        return dto;
    }

    private Sort resolveSort(String sortOrder) {
        if (sortOrder == null || sortOrder.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "id");
        }

        return switch (sortOrder.toLowerCase()) {
            case "asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "desc" -> Sort.by(Sort.Direction.DESC, "price");
            default -> Sort.by(Sort.Direction.DESC, "id");
        };
    }


}
