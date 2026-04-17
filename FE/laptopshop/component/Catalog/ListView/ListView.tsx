"use client";

import React from "react";
import Image from "next/image";
import { Pagination } from "@mui/material";
import { ProductDetailDto } from "@/types/product/ProductDetailDto";
import { ProductPageDto } from "@/types/product/ProductPageDto";
import { Spin } from "antd";

type ListViewProps = {
  products: ProductDetailDto[];
  loading?: boolean;
  pageData?: ProductPageDto;
  onPageChange?: (page: number) => void;
};

const formatPrice = (value?: number) => {
  if (value == null) return "Liên hệ";
  return value.toLocaleString("vi-VN") + " ₫";
};

const ListView = ({
  products,
  loading = false,
  pageData,
  onPageChange,
}: ListViewProps) => {
  if (loading)
    return (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );

  if (!products.length)
    return (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        Không tìm thấy sản phẩm.
      </div>
    );

  return (
    <div style={{ width: "100%" }}>
      {/* Danh sách sản phẩm */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {products.map((product) => (
          <div
            key={product.id}
            className="
              bg-white border border-gray-200 rounded-xl
              hover:border-gray-300 transition-colors duration-150
            "
          >
            <div
              className="flex flex-col lg:flex-row"
              style={{ gap: "20px", padding: "20px 22px" }}
            >
              {/* Ảnh sản phẩm */}
              <div
                className="
                  flex items-center justify-center shrink-0
                  bg-gray-50 rounded-lg
                  w-full lg:w-[200px]
                "
                style={{ padding: "12px" }}
              >
                <Image
                  src={product.avatar || "/product/msi-white.png"}
                  alt={product.name}
                  width={180}
                  height={200}
                  className="object-contain"
                />
              </div>

              {/* Thông tin sản phẩm */}
              <div className="flex flex-col flex-1" style={{ gap: "6px" }}>
                <h3
                  className="font-medium text-gray-900 leading-snug"
                  style={{ fontSize: "15px" }}
                >
                  {product.name}
                </h3>

                <p
                  className="text-gray-500 line-clamp-3"
                  style={{ fontSize: "13px", lineHeight: "1.6" }}
                >
                  {product.description}
                </p>

                <hr
                  className="border-gray-100"
                  style={{ margin: "10px 0", borderWidth: "0.5px" }}
                />

                {/* Giá + nút giỏ hàng */}
                <div
                  className="flex items-center justify-between flex-wrap"
                  style={{ gap: "8px" }}
                >
                  <div>
                    <span
                      className="font-medium text-gray-900"
                      style={{ fontSize: "20px" }}
                    >
                      {formatPrice(product.price)}
                    </span>
                    <p
                      className="text-gray-400"
                      style={{ fontSize: "12px", marginTop: "3px" }}
                    >
                      Còn {product.quantity} sản phẩm
                    </p>
                  </div>

                  <button
                    type="button"
                    className="
                      inline-flex items-center
                      border border-gray-200 rounded-lg
                      text-blue-600 bg-transparent
                      hover:bg-blue-50
                      transition-colors duration-100
                      font-medium
                    "
                    style={{
                      fontSize: "13px",
                      gap: "7px",
                      padding: "7px 14px",
                    }}
                  >
                    <Image
                      src="/icon/cart-blue.png"
                      alt="cart"
                      width={16}
                      height={16}
                    />
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      {pageData && pageData.totalPages > 1 && onPageChange && (
        <div className="flex justify-center" style={{ marginTop: "28px" }}>
          <Pagination
            count={pageData.totalPages}
            page={pageData.page + 1}
            shape="rounded"
            onChange={(_, value) => onPageChange(value - 1)}
          />
        </div>
      )}
    </div>
  );
};

export default ListView;
