"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { ProductDetailDto } from "@/types/product/ProductDetailDto";
import { detail as detailProduct } from "@/services/product/ProductApi";
import { StarOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import ProductReview from "./ProductReview";
import Image from "next/image";
import { me } from "@/services/user/UserService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart, createCart } from "@/store/slices/cartSlice";
import { CartItemDto } from "@/types/cart/cart";
import { notify } from "@/utils/notify";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";

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
  const dispatch = useAppDispatch();

  const { cart, pendingProductIds } = useAppSelector((state) => state.cart);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showReview, setShowReview] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isAdding = pendingProductIds.includes(id);

  useEffect(() => {
    setMounted(true);

    // Xử lý kiểm tra kích thước màn hình cho responsive padding
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      setMounted(false);
      window.removeEventListener("resize", handleResize);
    };
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

  const handleAddToCart = async () => {
    if (!product) return;

    if (product.quantity <= 0) {
      notify("info", "Sản phẩm đã hết hàng.");
      return;
    }

    if (quantity < 1) {
      notify("info", "Số lượng phải lớn hơn 0.");
      return;
    }

    if (quantity > product.quantity) {
      notify("info", "Số lượng vượt quá tồn kho.");
      return;
    }

    try {
      if (!cart) {
        await dispatch(createCart()).unwrap();
      }

      const item: CartItemDto = {
        productId: product.id,
        productName: product.name,
        avatar: product.avatar,
        price: product.price,
        qty: quantity,
      };

      await dispatch(
        addToCart({
          productId: product.id,
          quantity,
          item,
        }),
      ).unwrap();

      notify("success", "Đã thêm sản phẩm vào giỏ hàng.");
    } catch (error) {
      const message = getAxiosErrorMessage(error);
      notify("error", message);
    }
  };

  if (!open || !mounted) return null;

  const modalContent = (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/45 backdrop-blur-[8px] animate-fade-in"
      aria-modal="true"
      role="dialog"
      style={{ padding: "24px" }}
    >
      {/* Khai báo animation keyframes nội bộ */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpScale {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(16px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-up {
          animation: slideUpScale 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
      `}</style>

      <div className="relative w-full max-w-[860px] rounded-[24px] bg-white overflow-hidden max-h-[90vh] flex flex-col shadow-2xl animate-slide-up">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-[34px] h-[34px] rounded-full border border-slate-200 bg-white text-slate-500 cursor-pointer text-xl flex items-center justify-center shadow-sm transition-all duration-300 ease-out hover:bg-slate-50 hover:text-slate-800 hover:rotate-90 hover:border-slate-300 z-10"
          aria-label="Đóng"
          type="button"
        >
          ×
        </button>

        {loading ? (
          <div
            className="text-center text-slate-400 text-sm"
            style={{ padding: "48px" }}
          >
            <Spin />
          </div>
        ) : isError ? (
          <div
            className="text-center text-red-500 text-sm font-medium"
            style={{ padding: "48px" }}
          >
            Không thể tải chi tiết sản phẩm.
          </div>
        ) : !product ? (
          <div
            className="text-center text-slate-400 text-sm"
            style={{ padding: "48px" }}
          >
            Không có dữ liệu sản phẩm.
          </div>
        ) : (
          <div className="flex flex-col overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 overflow-auto">
              {/* Cột ảnh sản phẩm bên trái */}
              <div
                className="bg-slate-50/50 border-r border-slate-100/80 md:border-r md:border-b-0 border-b"
                style={{ padding: "24px" }}
              >
                <div className="aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-white flex items-center justify-center shadow-sm">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-500 ease-out hover:scale-[1.03]"
                    />
                  ) : (
                    <div
                      className="text-center text-slate-400 text-sm"
                      style={{ padding: "48px" }}
                    >
                      Không có ảnh sản phẩm.
                    </div>
                  )}
                </div>

                {allImages.length > 1 && (
                  <div
                    className="flex overflow-x-auto no-scrollbar"
                    style={{
                      marginTop: "12px",
                      paddingBottom: "4px",
                      gap: "8px",
                    }}
                  >
                    {allImages.map((img, index) => (
                      <button
                        key={`${img}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border bg-white transition-all duration-300 ${
                          selectedImage === img
                            ? "border-[#0156ff] opacity-100 shadow-[0_4px_12px_rgba(1,86,255,0.15)]"
                            : "border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300"
                        }`}
                        style={{ padding: 0 }}
                      >
                        <img
                          src={img}
                          alt={`${product.name}-${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cột thông tin sản phẩm bên phải */}
              <div
                className="flex flex-col"
                style={{ padding: "28px 24px 24px" }}
              >
                <h2
                  className="text-2xl font-extrabold text-slate-900 leading-tight tracking-tight"
                  style={{ margin: "0 0 8px 0" }}
                >
                  {product.name}
                </h2>

                <p
                  className="text-sm text-slate-500 leading-relaxed"
                  style={{ margin: "0 0 16px 0" }}
                >
                  {product.description || "Chưa có mô tả sản phẩm."}
                </p>

                <div
                  className="border-t border-slate-100"
                  style={{ paddingTop: "16px", marginBottom: "20px" }}
                >
                  <p
                    className="text-3xl font-extrabold text-[#0156ff] tracking-tight"
                    style={{ margin: "0 0 4px 0" }}
                  >
                    {formatPrice(product.price)}
                  </p>
                  <p
                    className="text-xs font-bold text-emerald-600"
                    style={{ margin: 0 }}
                  >
                    Còn {product.quantity} sản phẩm
                  </p>
                </div>

                <div className="flex flex-col" style={{ marginBottom: "20px" }}>
                  <p
                    className="text-xs font-bold text-slate-600"
                    style={{ margin: "0 0 8px 0" }}
                  >
                    Số lượng
                  </p>

                  <div className="inline-flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 self-start">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 border-none bg-transparent cursor-pointer text-xl text-slate-500 flex items-center justify-center transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed border-r border-slate-200"
                    >
                      −
                    </button>

                    <span className="w-12 text-center text-base font-bold text-slate-900 select-none">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) => Math.min(q + 1, product.quantity))
                      }
                      className="w-10 h-10 border-none bg-transparent cursor-pointer text-xl text-slate-500 flex items-center justify-center transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed border-l border-slate-200"
                      disabled={product.quantity <= 0}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Các nút hành động */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="h-11 rounded-xl border-2 border-[#0156ff] bg-transparent text-[#0156ff] text-sm font-bold cursor-pointer transition-all duration-300 hover:bg-blue-50/50 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={product.quantity <= 0 || isAdding}
                    onClick={handleAddToCart}
                  >
                    {isAdding ? "Đang thêm..." : "Thêm vào giỏ"}
                  </button>

                  <button
                    type="button"
                    className="h-11 rounded-xl border-none bg-gradient-to-r from-[#0156ff] to-[#004ee6] text-white text-sm font-bold cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(1,86,255,0.2)] hover:shadow-[0_6px_16px_rgba(1,86,255,0.3)] transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
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
                  className="h-10 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold cursor-pointer inline-flex items-center justify-center transition-all duration-300 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 self-start"
                  onClick={() => setShowReview((prev) => !prev)}
                  style={{ marginTop: "16px", padding: "0 14px", gap: "6px" }}
                >
                  <StarOutlined />
                  <span>{showReview ? "Ẩn đánh giá" : "Xem đánh giá"}</span>
                </button>

                {showReview && (
                  <div
                    className="border-t border-slate-100 bg-white"
                    style={{ padding: isMobile ? "16px 0 0 0" : "24px 0 0 0" }}
                  >
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
