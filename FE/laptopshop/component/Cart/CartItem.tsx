"use client";

import { CartItemDto } from "@/types/cart/cart";

const currency = (value: number) =>
  isNaN(value) ? "—" : `${value.toLocaleString("vi-VN")}₫`;

type CartItemProps = {
  item: CartItemDto;
  isPending?: boolean;
  onUpdateQty: (productId: number, newQty: number) => void;
  onRemove: (productId: number) => void;
};

export default function CartItem({
  item,
  isPending = false,
  onUpdateQty,
  onRemove,
}: CartItemProps) {
  // ✅ Fix: normalize field name — API có thể trả về `quantity` thay vì `qty`
  const qty: number =
    typeof item.qty === "number" && !isNaN(item.qty)
      ? item.qty
      : typeof (item as any).quantity === "number"
        ? (item as any).quantity
        : 1;

  const price: number =
    typeof item.price === "number" && !isNaN(item.price) ? item.price : 0;

  const lineTotal = price * qty;

  return (
    <div
      style={{
        opacity: isPending ? 0.55 : 1,
        pointerEvents: isPending ? "none" : "auto",
        transition: "opacity 0.25s ease, box-shadow 0.2s ease",
        background: "#ffffff",
        border: "1px solid #dbe7ff",
        borderRadius: "18px",
        padding: "20px 24px",
        boxShadow: "0 4px 24px rgba(15, 23, 42, 0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Loading overlay bar */}
      {isPending && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background:
              "linear-gradient(90deg, #0156FF 0%, #60a5fa 50%, #0156FF 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.2s linear infinite",
          }}
        />
      )}

      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .cart-item-remove:hover { background: #fee2e2 !important; border-color: #fca5a5 !important; }
        .cart-item-qty-btn:hover:not(:disabled) { background: #eff6ff !important; color: #0156FF !important; }
      `}</style>

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* ── Ảnh sản phẩm ── */}
        <div
          style={{
            width: "110px",
            height: "110px",
            borderRadius: "14px",
            background: "#f8faff",
            border: "1px solid #e6eef8",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
            flexShrink: 0,
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

        {/* ── Thông tin sản phẩm ── */}
        <div style={{ flex: "1 1 200px", minWidth: "180px" }}>
          <h3
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "17px",
              fontWeight: 700,
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.productName}
          </h3>

          <p
            style={{
              margin: "8px 0 0",
              color: "#64748b",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            Đơn giá:{" "}
            <strong style={{ color: "#0156FF", fontSize: "15px" }}>
              {currency(price)}
            </strong>
          </p>

          {/* Badge còn hàng */}
          <div
            style={{
              marginTop: "10px",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "4px 10px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "20px",
              color: "#15803d",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <circle cx="4" cy="4" r="4" fill="#22c55e" />
            </svg>
            Còn hàng
          </div>
        </div>

        {/* ── Controls: qty + tổng + xóa ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginLeft: "auto",
          }}
        >
          {/* Bộ chọn số lượng */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1.5px solid #dbe7ff",
              borderRadius: "12px",
              overflow: "hidden",
              background: "#f8fbff",
              height: "44px",
            }}
          >
            <button
              className="cart-item-qty-btn"
              onClick={() => onUpdateQty(item.productId, qty - 1)}
              disabled={qty <= 1}
              style={{
                width: "44px",
                height: "44px",
                border: "none",
                borderRight: "1.5px solid #dbe7ff",
                background: "transparent",
                cursor: qty <= 1 ? "not-allowed" : "pointer",
                color: qty <= 1 ? "#cbd5e1" : "#475569",
                fontSize: "20px",
                fontWeight: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s, color 0.15s",
              }}
              aria-label="Giảm số lượng"
            >
              −
            </button>

            <span
              style={{
                minWidth: "46px",
                textAlign: "center",
                color: "#0f172a",
                fontWeight: 700,
                fontSize: "16px",
                userSelect: "none",
              }}
            >
              {qty}
            </span>

            <button
              className="cart-item-qty-btn"
              onClick={() => onUpdateQty(item.productId, qty + 1)}
              style={{
                width: "44px",
                height: "44px",
                border: "none",
                borderLeft: "1.5px solid #dbe7ff",
                background: "transparent",
                cursor: "pointer",
                color: "#475569",
                fontSize: "20px",
                fontWeight: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s, color 0.15s",
              }}
              aria-label="Tăng số lượng"
            >
              +
            </button>
          </div>

          {/* Tạm tính */}
          <div
            style={{
              minWidth: "130px",
              textAlign: "right",
            }}
          >
            <div
              style={{
                color: "#0f172a",
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "-0.3px",
              }}
            >
              {currency(lineTotal)}
            </div>
            <div
              style={{
                color: "#94a3b8",
                fontSize: "12px",
                marginTop: "3px",
                fontWeight: 500,
              }}
            >
              Tạm tính
            </div>
          </div>

          {/* Nút xóa */}
          <button
            className="cart-item-remove"
            onClick={() => onRemove(item.productId)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              border: "1.5px solid #fecaca",
              background: "#fff5f5",
              color: "#ef4444",
              cursor: "pointer",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s, border-color 0.15s",
              flexShrink: 0,
            }}
            title="Xóa sản phẩm"
            aria-label="Xóa sản phẩm"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
