"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeFromWishlist } from "@/store/slices/wishlistSlice";
import WishlistCard from "./WishlistItem";
import { Spin } from "antd";

const introTextStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: "14px",
  lineHeight: 1.8,
};

const Wishlist = () => {
  const dispatch = useAppDispatch();
  const { wishlist, loading, error } = useAppSelector((s) => s.wishlist);

  const wishlistId = useAppSelector((s) => s.wishlist.wishlist?.id ?? null);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const items = wishlist?.items ?? [];
  const isEmpty = items.length === 0;
  const selectedCount = selectedItems.length;

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleRemove = (productId: number) => {
    if (!wishlistId) return;
    dispatch(removeFromWishlist({ productId }));
    setSelectedItems((prev) => prev.filter((id) => id !== productId));
  };

  const handleRemoveSelected = () => {
    if (!wishlistId) return;
    selectedItems.forEach((productId) =>
      dispatch(removeFromWishlist({ productId })),
    );
    setSelectedItems([]);
  };

  const handleAddToCart = (productId: number) => {
    console.log("Add to cart:", productId);
  };

  const handleAddSelectedToCart = () => {
    console.log("Add selected to cart:", selectedItems);
  };

  if (loading)
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#F5F7FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#64748b", fontSize: "16px" }}>
          <Spin size="large" />
        </div>
      </main>
    );

  if (error)
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#F5F7FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#dc2626", fontSize: "16px" }}>
          Không thể tải wishlist. Vui lòng thử lại.
        </div>
      </main>
    );

  return (
    <main style={{ minHeight: "100vh", background: "#F5F7FF" }}>
      <section className="container-global" style={{ padding: "42px 0 64px" }}>
        {/* Breadcrumb */}
        <div
          style={{ marginBottom: "20px", color: "#64748b", fontSize: "14px" }}
        >
          <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
            Trang chủ
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#0156FF", fontWeight: 600 }}>Wishlist</span>
        </div>

        {/* Header */}
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
            Danh sách yêu thích
          </h1>
          <p style={{ ...introTextStyle, margin: "10px 0 0" }}>
            {isEmpty
              ? "Danh sách yêu thích của bạn hiện chưa có sản phẩm nào."
              : `Bạn đang lưu ${items.length} sản phẩm để xem lại hoặc thêm nhanh vào giỏ hàng.`}
          </p>
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
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 20.5C11.82 20.5 11.63 20.43 11.49 20.29L4.91 13.84C3.08 12.04 3.03 9.09 4.8 7.3C6.57 5.5 9.5 5.45 11.33 7.25L12 7.92L12.67 7.25C14.5 5.45 17.43 5.5 19.2 7.3C20.97 9.09 20.92 12.04 19.09 13.84L12.51 20.29C12.37 20.43 12.18 20.5 12 20.5Z"
                  stroke="#0156FF"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
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
              Chưa có sản phẩm yêu thích
            </h2>
            <p
              style={{
                ...introTextStyle,
                maxWidth: "540px",
                margin: "12px auto 22px",
              }}
            >
              Bạn có thể thêm các sản phẩm quan tâm vào wishlist để theo dõi và
              mua sau.
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
            {/* Toolbar */}
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
                <div
                  style={{
                    color: "#0f172a",
                    fontSize: "22px",
                    fontWeight: 700,
                    marginBottom: "6px",
                  }}
                >
                  Sản phẩm đã lưu
                </div>
                <div style={introTextStyle}>
                  Chọn nhiều mục để xóa nhanh hoặc thêm vào giỏ hàng.
                </div>
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

            {/* Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "18px",
              }}
            >
              {items.map((item) => (
                <WishlistCard
                  key={item.productId}
                  item={item}
                  isSelected={selectedItems.includes(item.productId)}
                  onToggleSelect={toggleSelectItem}
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* Bottom bar */}
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
                Đã chọn{" "}
                <strong style={{ color: "#0156FF" }}>{selectedCount}</strong>{" "}
                sản phẩm
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <button
                  onClick={handleRemoveSelected}
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
                  onClick={handleAddSelectedToCart}
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
                    boxShadow:
                      selectedCount === 0
                        ? "none"
                        : "0 14px 30px rgba(1, 86, 255, 0.18)",
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
