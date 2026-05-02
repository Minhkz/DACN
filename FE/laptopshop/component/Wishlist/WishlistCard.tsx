"use client";
import Link from "next/link";
import { WishlistItemDto } from "@/types/wishlist/wishlist";
import { Button } from "antd";
import { useState } from "react";
import DetailProduct from "../DetailProduct/DetailProduct";

const formatCurrency = (value: number) => `${value.toLocaleString("vi-VN")}₫`;

type Props = {
  item: WishlistItemDto;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  onRemove: (productId: number) => void;
  onAddToCart: (productId: number) => void;
};

const WishlistCard = ({
  item,
  isSelected,
  onToggleSelect,
  onRemove,
  onAddToCart,
}: Props) => {
  const [openDetail, setOpenDetail] = useState(false);
  return (
    <div
      style={{
        background: "#ffffff",
        border: isSelected ? "1px solid #7fb0ff" : "1px solid #dbe7ff",
        borderRadius: "18px",
        padding: "20px",
        boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
        transition: "opacity 0.2s",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#475569",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(item.productId)}
            style={{ width: "16px", height: "16px", accentColor: "#0156FF" }}
          />
          Chọn sản phẩm
        </label>
        <button
          onClick={() => onRemove(item.productId)}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            border: "1px solid #fecaca",
            background: "#fff5f5",
            color: "#dc2626",
            cursor: "pointer",
            fontSize: "18px",
          }}
          title="Xóa khỏi wishlist"
        >
          ×
        </button>
      </div>

      {/* Ảnh */}
      <div
        style={{
          height: "190px",
          borderRadius: "16px",
          background: "#f8fbff",
          border: "1px solid #e6eef8",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          marginBottom: "18px",
        }}
      >
        <img
          src={item.avatar}
          alt={item.productName}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          onError={(e) => {
            e.currentTarget.src = "/img/banner.png";
          }}
        />
      </div>

      {/* Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "8px 12px",
          background: "#eff8f1",
          border: "1px solid #d0f0d7",
          borderRadius: "12px",
          color: "#15803d",
          fontSize: "12px",
          fontWeight: 700,
          marginBottom: "14px",
        }}
      >
        In stock
      </div>

      {/* Tên */}
      <h3
        style={{
          margin: 0,
          color: "#0f172a",
          fontSize: "17px",
          fontWeight: 700,
          lineHeight: 1.55,
          minHeight: "80px",
        }}
      >
        {item.productName}
      </h3>

      {/* Giá */}
      <div
        style={{
          paddingTop: "16px",
          marginTop: "16px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div style={{ color: "#0f172a", fontSize: "22px", fontWeight: 700 }}>
          {formatCurrency(item.price)}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
        <Button
          style={{
            flex: 1,
            height: "46px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            color: "#334155",
            fontSize: "14px",
            fontWeight: 700,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
          }}
          onClick={() => setOpenDetail(true)}
        >
          Chi tiết
        </Button>
        <button
          onClick={() => onAddToCart(item.productId)}
          style={{
            flex: 1,
            height: "46px",
            border: "none",
            borderRadius: "12px",
            background: "#0156FF",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 14px 30px rgba(1, 86, 255, 0.18)",
          }}
        >
          Thêm giỏ
        </button>
      </div>
      <DetailProduct
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        id={item.productId}
      />
    </div>
  );
};

export default WishlistCard;
