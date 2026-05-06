"use client";

import Header from "@/component/Header/Header";
import Footer from "@/component/Footer/Footer";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import CartItem from "@/component/Cart/CartItem";
import {
  fetchCart,
  removeFromCart,
  updateCartQuantity,
  clearCartProducts,
} from "@/store/slices/cartSlice";

const currency = (value: number) => `${value.toLocaleString("vi-VN")}₫`;

const mutedTextStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: "14px",
  lineHeight: 1.7,
};

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const { cart, loading, pendingProductIds } = useSelector(
    (state: RootState) => state.cart,
  );

  const handleUpdateQty = (productId: number, newQty: number) => {
    if (newQty < 1) return;
    dispatch(updateCartQuantity({ productId, quantity: newQty }));
  };

  const handleRemove = (productId: number) => {
    dispatch(removeFromCart({ productId }));
  };

  const handleClearCart = () => {
    dispatch(clearCartProducts());
  };

  const subtotal = useMemo(
    () =>
      cart?.items.reduce((sum, item) => sum + item.price * item.qty, 0) ?? 0,
    [cart?.items],
  );
  const shipping = subtotal > 5000000 ? 0 : 30000;
  const total = subtotal + shipping;

  // ─── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <main style={{ minHeight: "100vh", background: "#F5F7FF" }}>
          <section
            className="container-global"
            style={{ padding: "42px 0 64px" }}
          >
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #dbe7ff",
                borderRadius: "18px",
                padding: "28px",
                marginBottom: "24px",
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
              }}
            >
              <div
                style={{
                  height: "36px",
                  width: "240px",
                  borderRadius: "8px",
                  background: "#e2e8f0",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  background: "#ffffff",
                  border: "1px solid #dbe7ff",
                  borderRadius: "18px",
                  padding: "22px",
                  marginBottom: "18px",
                  height: "160px",
                  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <main style={{ minHeight: "100vh", background: "#F5F7FF" }}>
        <section
          className="container-global"
          style={{ padding: "42px 0 64px" }}
        >
          {/* Breadcrumb */}
          <div
            style={{ marginBottom: "20px", color: "#64748b", fontSize: "14px" }}
          >
            <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
              Trang chủ
            </Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#0156FF", fontWeight: 600 }}>Giỏ hàng</span>
          </div>

          {/* Header card */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #dbe7ff",
              borderRadius: "18px",
              padding: "28px",
              marginBottom: "24px",
              boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
            }}
          >
            <h1
              style={{
                margin: 0,
                color: "#0f172a",
                fontSize: "36px",
                fontWeight: 700,
              }}
            >
              Giỏ hàng của bạn
            </h1>
            {cart?.username && (
              <p style={{ ...mutedTextStyle, margin: "10px 0 0" }}>
                Xin chào <strong>{cart.username}</strong> — kiểm tra lại đơn
                hàng trước khi thanh toán.
              </p>
            )}
          </div>

          {/* Giỏ rỗng */}
          {!cart || cart.items.length === 0 ? (
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #dbe7ff",
                borderRadius: "18px",
                padding: "56px 28px",
                textAlign: "center",
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
              }}
            >
              <div
                style={{
                  width: "92px",
                  height: "92px",
                  margin: "0 auto 18px",
                  borderRadius: "18px",
                  background: "#eaf2ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6H21L19 15H8L6 6Z"
                    stroke="#0156FF"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 6L5.2 4.3C5.04 3.97 4.71 3.75 4.34 3.75H2.5"
                    stroke="#0156FF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle cx="9" cy="19" r="1.5" fill="#0156FF" />
                  <circle cx="18" cy="19" r="1.5" fill="#0156FF" />
                </svg>
              </div>
              <h2
                style={{
                  margin: 0,
                  color: "#0f172a",
                  fontSize: "28px",
                  fontWeight: 700,
                }}
              >
                Giỏ hàng đang trống
              </h2>
              <p
                style={{
                  ...mutedTextStyle,
                  maxWidth: "520px",
                  margin: "12px auto 22px",
                }}
              >
                Hãy tiếp tục khám phá sản phẩm để thêm vào giỏ và hoàn tất đơn
                hàng.
              </p>
              <Link
                href="/catalogs"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "180px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "#0156FF",
                  color: "#ffffff",
                  fontWeight: 700,
                  textDecoration: "none",
                  padding: "0 22px",
                }}
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "24px",
                alignItems: "flex-start",
              }}
            >
              {/* Danh sách sản phẩm */}
              <div
                style={{
                  flex: "1 1 720px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                {/* Toolbar xóa tất cả */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={handleClearCart}
                    style={{
                      border: "1px solid #fecaca",
                      background: "#fff5f5",
                      color: "#dc2626",
                      borderRadius: "10px",
                      padding: "8px 16px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Xóa tất cả
                  </button>
                </div>

                {cart.items.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    isPending={pendingProductIds.includes(item.productId)}
                    onUpdateQty={handleUpdateQty}
                    onRemove={handleRemove}
                  />
                ))}
              </div>

              {/* Sidebar tóm tắt */}
              <aside
                style={{
                  flex: "0 1 360px",
                  width: "100%",
                  background: "#ffffff",
                  border: "1px solid #dbe7ff",
                  borderRadius: "18px",
                  padding: "26px",
                  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
                  position: "sticky",
                  top: "18px",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    color: "#0f172a",
                    fontSize: "24px",
                    fontWeight: 700,
                  }}
                >
                  Tóm tắt đơn hàng
                </h2>
                <p style={{ ...mutedTextStyle, margin: "8px 0 20px" }}>
                  Kiểm tra nhanh chi phí trước khi tiến hành thanh toán.
                </p>

                <div
                  style={{
                    borderTop: "1px solid #e2e8f0",
                    borderBottom: "1px solid #e2e8f0",
                    padding: "18px 0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                      color: "#475569",
                      fontSize: "15px",
                    }}
                  >
                    <span>Tạm tính</span>
                    <strong style={{ color: "#0f172a" }}>
                      {currency(subtotal)}
                    </strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                      color: "#475569",
                      fontSize: "15px",
                    }}
                  >
                    <span>Vận chuyển</span>
                    <strong
                      style={{ color: shipping === 0 ? "#15803d" : "#0f172a" }}
                    >
                      {shipping === 0 ? "Miễn phí" : currency(shipping)}
                    </strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#0f172a",
                      fontSize: "18px",
                      fontWeight: 700,
                    }}
                  >
                    <span>Tổng cộng</span>
                    <span>{currency(total)}</span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <button
                    style={{
                      height: "50px",
                      border: "none",
                      borderRadius: "12px",
                      background: "#0156FF",
                      color: "#ffffff",
                      fontSize: "15px",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 14px 30px rgba(1, 86, 255, 0.18)",
                    }}
                    // onClick={() => router.push("/checkout")}
                  >
                    Tiến hành thanh toán
                  </button>

                  <Link
                    href="/catalogs"
                    style={{
                      height: "50px",
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
                  >
                    Tiếp tục mua sắm
                  </Link>
                </div>
              </aside>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
