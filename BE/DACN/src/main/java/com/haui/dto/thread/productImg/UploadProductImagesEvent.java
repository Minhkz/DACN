package com.haui.dto.thread.productImg;

import java.util.List;

public record UploadProductImagesEvent(List<byte[]> images,
                                       Integer productId) {
}
