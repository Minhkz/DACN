"use client";

import Header from "@/component/Header/Header";
import Footer from "@/component/Footer/Footer";
import Link from "next/link";
import { useMemo, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
};

const currency = (value: number) => `${value.toLocaleString("vi-VN")}₫`;

const mutedTextStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: "14px",
  lineHeight: 1.7,
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: "Laptop ABC", price: 12990000, qty: 1, image: "/product/msi-pro16.png" },
    { id: 2, name: "Chuột không dây", price: 350000, qty: 2, image: "/product/msi-white.png" },
    { id: 3, name: "Bàn phím cơ", price: 1590000, qty: 1, image: "/product/detail.png" },
    { id: 4, name: "Tai nghe gaming", price: 890000, qty: 1, image: "/product/msi-pro16.png" },
  ]);

  const updateQty = (id: number, newQty: number) => {
    if (newQty < 1) return;
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, qty: newQty } : item)));
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartItems],
  );
  const shipping = subtotal > 5000000 ? 0 : 30000;
  const total = subtotal + shipping;

  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", background: "#F5F7FF" }}>
        <section className="container-global" style={{ padding: "42px 0 64px" }}>
          <div style={{ marginBottom: "20px", color: "#64748b", fontSize: "14px" }}>
            <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
              Trang chủ
            </Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#0156FF", fontWeight: 600 }}>Giỏ hàng</span>
          </div>

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
            <h1 style={{ margin: 0, color: "#0f172a", fontSize: "36px", fontWeight: 700 }}>
              Giỏ hàng của bạn
            </h1>
            <p style={{ ...mutedTextStyle, margin: "10px 0 0" }}>
              Bố cục được làm lại theo hướng đồng bộ với toàn website: sáng,
              đầy đặn, dễ quan sát và bớt bo tròn hơn trước.
            </p>
          </div>

          {cartItems.length === 0 ? (
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
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6H21L19 15H8L6 6Z" stroke="#0156FF" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M6 6L5.2 4.3C5.04 3.97 4.71 3.75 4.34 3.75H2.5" stroke="#0156FF" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="9" cy="19" r="1.5" fill="#0156FF" />
                  <circle cx="18" cy="19" r="1.5" fill="#0156FF" />
                </svg>
              </div>
              <h2 style={{ margin: 0, color: "#0f172a", fontSize: "28px", fontWeight: 700 }}>
                Giỏ hàng đang trống
              </h2>
              <p style={{ ...mutedTextStyle, maxWidth: "520px", margin: "12px auto 22px" }}>
                Hãy tiếp tục khám phá sản phẩm để thêm vào giỏ và hoàn tất đơn hàng.
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" }}>
              <div style={{ flex: "1 1 720px", display: "flex", flexDirection: "column", gap: "18px" }}>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #dbe7ff",
                      borderRadius: "18px",
                      padding: "22px",
                      boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
                    }}
                  >
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", alignItems: "center" }}>
                      <div
                        style={{
                          width: "120px",
                          height: "120px",
                          borderRadius: "16px",
                          background: "#f8fbff",
                          border: "1px solid #e6eef8",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "12px",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          onError={(e) => {
                            e.currentTarget.src = "/img/banner.png";
                          }}
                        />
                      </div>

                      <div style={{ flex: "1 1 240px", minWidth: "220px" }}>
                        <h3 style={{ margin: 0, color: "#0f172a", fontSize: "20px", fontWeight: 700, lineHeight: 1.45 }}>
                          {item.name}
                        </h3>
                        <p style={{ ...mutedTextStyle, margin: "8px 0 0" }}>
                          Đơn giá: <strong style={{ color: "#0f172a" }}>{currency(item.price)}</strong>
                        </p>
                        <div
                          style={{
                            marginTop: "12px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            background: "#eff8f1",
                            border: "1px solid #d0f0d7",
                            borderRadius: "12px",
                            color: "#15803d",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          Còn hàng
                        </div>
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center", marginLeft: "auto" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #dbe7ff",
                            borderRadius: "14px",
                            overflow: "hidden",
                            background: "#f8fbff",
                          }}
                        >
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            disabled={item.qty <= 1}
                            style={{
                              width: "42px",
                              height: "42px",
                              border: "none",
                              borderRight: "1px solid #dbe7ff",
                              background: "transparent",
                              cursor: item.qty <= 1 ? "not-allowed" : "pointer",
                              color: item.qty <= 1 ? "#94a3b8" : "#334155",
                              fontSize: "20px",
                            }}
                          >
                            −
                          </button>
                          <span style={{ minWidth: "48px", textAlign: "center", color: "#0f172a", fontWeight: 700 }}>
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            style={{
                              width: "42px",
                              height: "42px",
                              border: "none",
                              borderLeft: "1px solid #dbe7ff",
                              background: "transparent",
                              cursor: "pointer",
                              color: "#334155",
                              fontSize: "20px",
                            }}
                          >
                            +
                          </button>
                        </div>

                        <div style={{ minWidth: "140px", textAlign: "right" }}>
                          <div style={{ color: "#0f172a", fontSize: "21px", fontWeight: 700 }}>
                            {currency(item.price * item.qty)}
                          </div>
                          <div style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}>Tạm tính</div>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "12px",
                            border: "1px solid #fecaca",
                            background: "#fff5f5",
                            color: "#dc2626",
                            cursor: "pointer",
                            fontSize: "20px",
                          }}
                          title="Xóa sản phẩm"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

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
                <h2 style={{ margin: 0, color: "#0f172a", fontSize: "24px", fontWeight: 700 }}>
                  Tóm tắt đơn hàng
                </h2>
                <p style={{ ...mutedTextStyle, margin: "8px 0 20px" }}>
                  Kiểm tra nhanh chi phí trước khi tiến hành thanh toán.
                </p>

                <div style={{ borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "18px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#475569", fontSize: "15px" }}>
                    <span>Tạm tính</span>
                    <strong style={{ color: "#0f172a" }}>{currency(subtotal)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#475569", fontSize: "15px" }}>
                    <span>Vận chuyển</span>
                    <strong style={{ color: shipping === 0 ? "#15803d" : "#0f172a" }}>
                      {shipping === 0 ? "Miễn phí" : currency(shipping)}
                    </strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#0f172a", fontSize: "18px", fontWeight: 700 }}>
                    <span>Tổng cộng</span>
                    <span>{currency(total)}</span>
                  </div>
                </div>

                <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
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
      <Footer />
    </>
  );
}
