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
      className="cart-item-card"
      style={{
        opacity: isPending ? 0.55 : 1,
        pointerEvents: isPending ? "none" : "auto",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        background: "#ffffff",
        border: "1px solid #f1f5f9",
        borderRadius: "16px",
        padding: "20px 24px",
        boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.04)",
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
        .cart-item-card:hover { border-color: #dbe7ff !important; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08) !important; }
        .cart-item-remove:hover { background: #fef2f2 !important; border-color: #fca5a5 !important; color: #dc2626 !important; }
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
            borderRadius: "12px",
            background: "#f8fafc",
            border: "1px solid #f1f5f9",
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
              fontSize: "16px",
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
              margin: "6px 0 0 0",
              color: "#64748b",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            Đơn giá:{" "}
            <strong
              style={{ color: "#0156FF", fontSize: "14px", marginLeft: "4px" }}
            >
              {currency(price)}
            </strong>
          </p>

          {/* Badge còn hàng */}
          <div
            style={{
              marginTop: "10px",
              padding: "4px 12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#ecfdf5",
              border: "1px solid #d1fae5",
              borderRadius: "9999px",
              color: "#047857",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-500"
              style={{ display: "inline-block" }}
            />
            Còn hàng
          </div>
        </div>

        {/* ── Controls: qty + tổng + xóa ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
            marginLeft: "auto",
          }}
        >
          {/* Bộ chọn số lượng */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              overflow: "hidden",
              background: "#f8fafc",
              height: "40px",
            }}
          >
            <button
              className="cart-item-qty-btn"
              onClick={() => onUpdateQty(item.productId, qty - 1)}
              disabled={qty <= 1}
              style={{
                width: "40px",
                height: "40px",
                border: "none",
                borderRight: "1px solid #e2e8f0",
                background: "transparent",
                cursor: qty <= 1 ? "not-allowed" : "pointer",
                color: qty <= 1 ? "#cbd5e1" : "#475569",
                fontSize: "18px",
                fontWeight: 400,
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
                minWidth: "40px",
                textAlign: "center",
                color: "#0f172a",
                fontWeight: 700,
                fontSize: "15px",
                userSelect: "none",
              }}
            >
              {qty}
            </span>

            <button
              className="cart-item-qty-btn"
              onClick={() => onUpdateQty(item.productId, qty + 1)}
              style={{
                width: "40px",
                height: "40px",
                border: "none",
                borderLeft: "1px solid #e2e8f0",
                background: "transparent",
                cursor: "pointer",
                color: "#475569",
                fontSize: "18px",
                fontWeight: 400,
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
              minWidth: "120px",
              textAlign: "right",
            }}
          >
            <div
              style={{
                color: "#0f172a",
                fontSize: "18px",
                fontWeight: 800,
                letterSpacing: "-0.025em",
              }}
            >
              {currency(lineTotal)}
            </div>
            <div
              style={{
                color: "#94a3b8",
                fontSize: "11px",
                marginTop: "4px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
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
              border: "1px solid #fee2e2",
              background: "#fff5f5",
              color: "#ef4444",
              cursor: "pointer",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
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
