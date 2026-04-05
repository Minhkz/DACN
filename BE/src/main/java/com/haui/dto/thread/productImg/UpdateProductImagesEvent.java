package com.haui.dto.thread.productImg;

import java.util.List;

public record UpdateProductImagesEvent(List<byte[]> images,
                                       Integer productId,
                                       List<String> oldPublicId) {
}
