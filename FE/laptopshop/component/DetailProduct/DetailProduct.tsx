import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ProductDetailDto } from "@/types/product/ProductDetailDto";
import { detail as detailProduct } from "@/services/product/ProductApi";
import { StarOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import ProductReview from "./ProductReview";
import styles from "./DetailProduct.module.css";
import Image from "next/image";

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
  const [product, setProduct] = useState<ProductDetailDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open || !id) return;

    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);
        setQuantity(1);
        setSelectedImage("");
        setShowReview(false);

        const data = await detailProduct(id);

        if (!isMounted) return;

        setProduct(data);
        setSelectedImage(data.avatar || data.imgs?.[0] || "");
      } catch (err) {
        console.error("Lỗi lấy chi tiết sản phẩm:", err);
        if (isMounted) {
          setError("Không thể tải chi tiết sản phẩm.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id, open]);

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

  const allImages = useMemo(() => {
    if (!product) return [];
    const arr = [product.avatar, ...(product.imgs || [])].filter(
      Boolean,
    ) as string[];
    return [...new Set(arr)];
  }, [product]);

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
        ) : error ? (
          <div className={styles.errorBox}>{error}</div>
        ) : !product ? (
          <div className={styles.stateBox}>Không có dữ liệu sản phẩm.</div>
        ) : (
          <div className={styles.modalBody}>
            <div className={styles.content}>
              <div className={styles.leftPanel}>
                <div className={styles.mainImageWrapper}>
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className={styles.mainImage}
                  />
                </div>

                {allImages.length > 1 && (
                  <div className={styles.thumbnailList}>
                    {allImages.map((img, index) => (
                      <button
                        key={index}
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
                  {product.description}
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
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={styles.actionGroup}>
                  <button type="button" className={styles.outlineButton}>
                    Thêm vào giỏ
                  </button>

                  <button type="button" className={styles.primaryButton}>
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
              </div>
            </div>

            {showReview && (
              <div className={styles.reviewSection}>
                <ProductReview productId={id} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
