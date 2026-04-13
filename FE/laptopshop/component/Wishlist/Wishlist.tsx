"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

type WishlistProduct = {
  id: number;
  name: string;
  oldPrice: number;
  price: number;
  image: string;
};

const formatCurrency = (value: number) => `${value.toLocaleString("vi-VN")}₫`;

const introTextStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: "14px",
  lineHeight: 1.8,
};

const productsSeed: WishlistProduct[] = Array.from({ length: 8 }).map((_, index) => ({
  id: index + 1,
  name: "EX DISPLAY : MSI Pro 16 Flex-036AU 15.6 MULTITOUCH All-In-One",
  oldPrice: 19990000,
  price: 17990000,
  image: "/product/msi-pro16.png",
}));

const Wishlist = () => {
  const [products, setProducts] = useState<WishlistProduct[]>(productsSeed);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const isEmpty = products.length === 0;
  const selectedCount = selectedItems.length;

  const summaryText = useMemo(() => {
    if (isEmpty) return "Danh sách yêu thích của bạn hiện chưa có sản phẩm nào.";
    return `Bạn đang lưu ${products.length} sản phẩm để xem lại hoặc thêm nhanh vào giỏ hàng.`;
  }, [isEmpty, products.length]);

  const toggleSelectItem = (id: number) => {
    setSelectedItems((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id],
    );
  };

  const removeItem = (id: number) => {
    setProducts((current) => current.filter((item) => item.id !== id));
    setSelectedItems((current) => current.filter((itemId) => itemId !== id));
  };

  const removeSelected = () => {
    setProducts((current) => current.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const addSelectedToCart = () => {
    console.log("Thêm vào giỏ hàng:", selectedItems);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#F5F7FF" }}>
      <section className="container-global" style={{ padding: "42px 0 64px" }}>
        <div style={{ marginBottom: "20px", color: "#64748b", fontSize: "14px" }}>
          <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
            Trang chủ
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#0156FF", fontWeight: 600 }}>Wishlist</span>
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
            Danh sách yêu thích
          </h1>
          <p style={{ ...introTextStyle, margin: "10px 0 0" }}>{summaryText}</p>
        </div>

        {isEmpty ? (
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
                <path d="M12 20.5C11.82 20.5 11.63 20.43 11.49 20.29L4.91 13.84C3.08 12.04 3.03 9.09 4.8 7.3C6.57 5.5 9.5 5.45 11.33 7.25L12 7.92L12.67 7.25C14.5 5.45 17.43 5.5 19.2 7.3C20.97 9.09 20.92 12.04 19.09 13.84L12.51 20.29C12.37 20.43 12.18 20.5 12 20.5Z" stroke="#0156FF" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={{ margin: 0, color: "#0f172a", fontSize: "28px", fontWeight: 700 }}>
              Chưa có sản phẩm yêu thích
            </h2>
            <p style={{ ...introTextStyle, maxWidth: "540px", margin: "12px auto 22px" }}>
              Bạn có thể thêm các sản phẩm quan tâm vào wishlist để theo dõi và mua sau.
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
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                background: "#ffffff",
                border: "1px solid #dbe7ff",
                borderRadius: "18px",
                padding: "22px 24px",
                marginBottom: "18px",
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
              }}
            >
              <div>
                <div style={{ color: "#0f172a", fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>
                  Sản phẩm đã lưu
                </div>
                <div style={introTextStyle}>Chọn nhiều mục để xóa nhanh hoặc thêm vào giỏ hàng.</div>
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#eaf2ff",
                  color: "#0156FF",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  fontWeight: 700,
                }}
              >
                {selectedCount} mục đã chọn
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "18px",
              }}
            >
              {products.map((product) => {
                const isSelected = selectedItems.includes(product.id);

                return (
                  <div
                    key={product.id}
                    style={{
                      background: "#ffffff",
                      border: isSelected ? "1px solid #7fb0ff" : "1px solid #dbe7ff",
                      borderRadius: "18px",
                      padding: "20px",
                      boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "16px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "10px", color: "#475569", fontSize: "13px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(product.id)}
                          style={{ width: "16px", height: "16px", accentColor: "#0156FF" }}
                        />
                        Chọn sản phẩm
                      </label>

                      <button
                        onClick={() => removeItem(product.id)}
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
                        src={product.image}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        onError={(e) => {
                          e.currentTarget.src = "/img/banner.png";
                        }}
                      />
                    </div>

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

                    <h3 style={{ margin: 0, color: "#0f172a", fontSize: "17px", fontWeight: 700, lineHeight: 1.55, minHeight: "80px" }}>
                      {product.name}
                    </h3>

                    <div style={{ paddingTop: "16px", marginTop: "16px", borderTop: "1px solid #e2e8f0" }}>
                      <div style={{ color: "#94a3b8", fontSize: "13px", textDecoration: "line-through", marginBottom: "6px" }}>
                        {formatCurrency(product.oldPrice)}
                      </div>
                      <div style={{ color: "#0f172a", fontSize: "22px", fontWeight: 700 }}>
                        {formatCurrency(product.price)}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                      <Link
                        href={`/product/${product.id}`}
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
                      >
                        Chi tiết
                      </Link>

                      <button
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
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: "20px",
                background: "#ffffff",
                border: "1px solid #dbe7ff",
                borderRadius: "18px",
                padding: "22px 24px",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "14px",
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
              }}
            >
              <div style={{ color: "#334155", fontSize: "15px" }}>
                Đã chọn <strong style={{ color: "#0156FF" }}>{selectedCount}</strong> sản phẩm
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <button
                  onClick={removeSelected}
                  disabled={selectedCount === 0}
                  style={{
                    minWidth: "150px",
                    height: "46px",
                    borderRadius: "12px",
                    border: "1px solid #fecaca",
                    background: selectedCount === 0 ? "#fffafa" : "#fff5f5",
                    color: selectedCount === 0 ? "#fca5a5" : "#dc2626",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: selectedCount === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  Xóa mục chọn
                </button>

                <button
                  onClick={addSelectedToCart}
                  disabled={selectedCount === 0}
                  style={{
                    minWidth: "190px",
                    height: "46px",
                    border: "none",
                    borderRadius: "12px",
                    background: selectedCount === 0 ? "#93c5fd" : "#0156FF",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: selectedCount === 0 ? "not-allowed" : "pointer",
                    boxShadow: selectedCount === 0 ? "none" : "0 14px 30px rgba(1, 86, 255, 0.18)",
                  }}
                >
                  Thêm tất cả vào giỏ
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Wishlist;
