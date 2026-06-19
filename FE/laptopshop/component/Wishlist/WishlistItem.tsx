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
      className="relative bg-white border rounded-[22px] shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
      style={{
        padding: "20px",
        border: isSelected ? "1.5px solid #0156ff" : "1.5px solid #f1f5f9",
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
          className="select-none"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#64748b",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(item.productId)}
            style={{
              width: "16px",
              height: "16px",
              accentColor: "#0156FF",
              cursor: "pointer",
            }}
          />
          Chọn sản phẩm
        </label>

        <button
          onClick={() => onRemove(item.productId)}
          className="w-8 h-8 rounded-lg border border-rose-100 bg-rose-50 text-rose-500 cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-rose-500 hover:text-white hover:border-transparent active:scale-95"
          style={{ padding: 0 }}
          title="Xóa khỏi wishlist"
        >
          ×
        </button>
      </div>

      {/* Ảnh */}
      <div
        className="relative rounded-[16px] bg-slate-50/50 border border-slate-100/50 overflow-hidden flex items-center justify-center transition-transform duration-300 hover:scale-[1.01]"
        style={{
          height: "190px",
          padding: "16px",
          marginBottom: "18px",
        }}
      >
        <img
          src={item.avatar}
          alt={item.productName}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = "/img/banner.png";
          }}
        />
      </div>

      {/* Badge trạng thái */}
      <div
        className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg"
        style={{
          padding: "6px 12px",
          marginBottom: "14px",
          gap: "5px",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        In stock
      </div>

      {/* Tên sản phẩm */}
      <h3
        className="text-slate-800 text-sm font-bold leading-relaxed line-clamp-2 hover:text-[#0156ff] transition-colors cursor-pointer"
        onClick={() => setOpenDetail(true)}
        style={{
          margin: 0,
          minHeight: "44px",
        }}
      >
        {item.productName}
      </h3>

      {/* Giá tiền */}
      <div
        className="border-t border-slate-100"
        style={{
          paddingTop: "16px",
          marginTop: "16px",
        }}
      >
        <div
          className="text-xl font-extrabold text-slate-900 tracking-tight"
          style={{ margin: 0 }}
        >
          {formatCurrency(item.price)}
        </div>
      </div>

      {/* Nút hành động */}
      <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
        <Button
          style={{
            flex: 1,
            height: "40px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
            color: "#334155",
            fontSize: "12px",
            fontWeight: 700,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
          }}
          className="hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 active:scale-[0.98]"
          onClick={() => setOpenDetail(true)}
        >
          Chi tiết
        </Button>

        <button
          onClick={() => onAddToCart(item.productId)}
          className="flex-1 h-10 border-none rounded-xl bg-gradient-to-r from-[#0156ff] to-[#004ee6] text-white font-bold text-xs shadow-[0_4px_12px_rgba(1,86,255,0.15)] hover:shadow-[0_6px_16px_rgba(1,86,255,0.25)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer active:scale-[0.98]"
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
