"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { ProductDetailDto } from "@/types/product/ProductDetailDto";
import { detail as detailProduct } from "@/services/product/ProductApi";
import { StarOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import ProductReview from "./ProductReview";
import styles from "./DetailProduct.module.css";
import Image from "next/image";
import { me } from "@/services/user/UserApi";

type DetailProductProps = {
  open: boolean;
  onClose: () => void;
  id: number;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

export default function DetailProduct({
  open,
  onClose,
  id,
}: DetailProductProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showReview, setShowReview] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const {
    data: product,
    isLoading: loading,
    isError,
  } = useQuery<ProductDetailDto>({
    queryKey: ["product-detail", id],
    queryFn: () => detailProduct(id),
    enabled: open && !!id,
  });

  const { data: profile } = useQuery({
    queryKey: ["me"],
    queryFn: me,
    enabled: open,
  });

  const userId = Number(profile?.id) || 0;

  const allImages = useMemo(() => {
    if (!product) return [];
    const arr = [product.avatar, ...(product.imgs || [])].filter(
      (img): img is string => Boolean(img && img.trim()),
    );
    return [...new Set(arr)];
  }, [product]);

  useEffect(() => {
    if (!product) {
      setSelectedImage(null);
      return;
    }

    setQuantity(1);
    setShowReview(false);
    setSelectedImage(allImages[0] ?? null);
  }, [product, allImages]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open || !mounted) return null;

  const modalContent = (
    <div
      onClick={handleBackdropClick}
      className={styles.backdrop}
      aria-modal="true"
      role="dialog"
    >
      <div className={styles.modal}>
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Đóng"
          type="button"
        >
          ×
        </button>

        {loading ? (
          <div className={styles.stateBox}>
            <Spin />
          </div>
        ) : isError ? (
          <div className={styles.errorBox}>
            Không thể tải chi tiết sản phẩm.
          </div>
        ) : !product ? (
          <div className={styles.stateBox}>Không có dữ liệu sản phẩm.</div>
        ) : (
          <div className={styles.modalBody}>
            <div className={styles.content}>
              <div className={styles.leftPanel}>
                <div className={styles.mainImageWrapper}>
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product.name}
                      className={styles.mainImage}
                    />
                  ) : (
                    <div className={styles.stateBox}>
                      Không có ảnh sản phẩm.
                    </div>
                  )}
                </div>

                {allImages.length > 1 && (
                  <div className={styles.thumbnailList}>
                    {allImages.map((img, index) => (
                      <button
                        key={`${img}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`${styles.thumbnailButton} ${
                          selectedImage === img
                            ? styles.thumbnailButtonActive
                            : ""
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name}-${index + 1}`}
                          className={styles.thumbnailImage}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.rightPanel}>
                <h2 className={styles.productName}>{product.name}</h2>

                <p className={styles.productDescription}>
                  {product.description || "Chưa có mô tả sản phẩm."}
                </p>

                <div className={styles.priceSection}>
                  <p className={styles.price}>{formatPrice(product.price)}</p>
                  <p className={styles.stock}>
                    Còn {product.quantity} sản phẩm
                  </p>
                </div>

                <div className={styles.quantitySection}>
                  <p className={styles.quantityLabel}>Số lượng</p>
                  <div className={styles.quantityControl}>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className={`${styles.quantityButton} ${styles.quantityButtonMinus}`}
                    >
                      −
                    </button>

                    <span className={styles.quantityValue}>{quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) => Math.min(q + 1, product.quantity))
                      }
                      className={`${styles.quantityButton} ${styles.quantityButtonPlus}`}
                      disabled={product.quantity <= 0}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={styles.actionGroup}>
                  <button
                    type="button"
                    className={styles.outlineButton}
                    disabled={product.quantity <= 0}
                  >
                    Thêm vào giỏ
                  </button>

                  <button
                    type="button"
                    className={styles.primaryButton}
                    disabled={product.quantity <= 0}
                  >
                    <Image
                      src="/logo/vnpay.png"
                      alt="vnpay"
                      width={28}
                      height={28}
                    />
                    Thanh toán
                  </button>
                </div>

                <button
                  type="button"
                  className={styles.reviewToggle}
                  onClick={() => setShowReview((prev) => !prev)}
                >
                  <StarOutlined />
                  <span>{showReview ? "Ẩn đánh giá" : "Xem đánh giá"}</span>
                </button>

                {showReview && (
                  <div className={styles.reviewSection}>
                    <ProductReview productId={id} userId={userId} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
