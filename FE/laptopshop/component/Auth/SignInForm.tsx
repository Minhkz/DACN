"use client";

import Header from "@/component/Header/Header";
import Footer from "@/component/Footer/Footer";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type AuthResponse = {
  success?: boolean;
  message?: string;
};

type ApiErrorResponse = {
  message?: string;
};

const pageShellStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#F5F7FF",
};

const sectionStyle: React.CSSProperties = {
  padding: "48px 0 64px",
};

const panelWrapStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "28px",
  alignItems: "stretch",
};

const infoPanelStyle: React.CSSProperties = {
  flex: "1 1 360px",
  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
  border: "1px solid #dbe7ff",
  borderRadius: "18px",
  padding: "36px 34px",
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
};

const formPanelStyle: React.CSSProperties = {
  flex: "1 1 420px",
  background: "#ffffff",
  border: "1px solid #e3ebf6",
  borderRadius: "18px",
  padding: "36px 34px",
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "50px",
  border: "1px solid #d6e0ef",
  borderRadius: "12px",
  padding: "0 16px",
  fontSize: "14px",
  color: "#1f2937",
  background: "#ffffff",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "10px",
  fontSize: "13px",
  fontWeight: 600,
  color: "#334155",
};

const bulletStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "14px",
  color: "#475569",
  fontSize: "14px",
  lineHeight: 1.6,
};

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#E0ECFF" />
      <path d="M7 12.5L10.2 15.5L17 8.5" stroke="#0156FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SignInForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError("Vui lòng nhập username và mật khẩu");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post<AuthResponse>(
        "/api/auth/login",
        {
          username: trimmedUsername,
          password,
          rememberMe: isChecked,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.data?.success) {
        router.replace("/");
        router.refresh();
        return;
      }

      setError(response.data?.message || "Đăng nhập thất bại");
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        setError(err.response?.data?.message || "Đăng nhập thất bại");
      } else {
        setError("Đã xảy ra lỗi không mong muốn");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main style={pageShellStyle}>
        <section className="container-global" style={sectionStyle}>
          <div style={{ marginBottom: "20px", color: "#64748b", fontSize: "14px" }}>
            <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
              Trang chủ
            </Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#0156FF", fontWeight: 600 }}>Đăng nhập</span>
          </div>

          <div style={panelWrapStyle}>
            <div style={infoPanelStyle}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  background: "#eaf2ff",
                  color: "#0156FF",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: "18px",
                }}
              >
                Laptop Shop
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "38px",
                  lineHeight: 1.2,
                  color: "#0f172a",
                  fontWeight: 700,
                }}
              >
                Đăng nhập để tiếp tục mua sắm thuận tiện hơn
              </h1>

              <p
                style={{
                  margin: "18px 0 28px",
                  color: "#475569",
                  fontSize: "15px",
                  lineHeight: 1.8,
                  maxWidth: "560px",
                }}
              >
                Giao diện được làm dịu hơn để đồng bộ với toàn bộ website: sạch,
                sáng, cân đối và dễ thao tác trên cả desktop lẫn màn hình nhỏ.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "14px",
                  marginBottom: "24px",
                }}
              >
                <div style={{ ...bulletStyle, marginBottom: 0, background: "#fff", border: "1px solid #e5edf8", borderRadius: "14px", padding: "16px" }}>
                  <CheckIcon />
                  Mua hàng nhanh và quản lý đơn tiện lợi
                </div>
                <div style={{ ...bulletStyle, marginBottom: 0, background: "#fff", border: "1px solid #e5edf8", borderRadius: "14px", padding: "16px" }}>
                  <CheckIcon />
                  Lưu địa chỉ, giỏ hàng và sản phẩm yêu thích
                </div>
                <div style={{ ...bulletStyle, marginBottom: 0, background: "#fff", border: "1px solid #e5edf8", borderRadius: "14px", padding: "16px" }}>
                  <CheckIcon />
                  Nhận ưu đãi và cập nhật mới từ cửa hàng
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px solid #dbe7ff",
                  paddingTop: "22px",
                  color: "#475569",
                  fontSize: "14px",
                  lineHeight: 1.8,
                }}
              >
                Chưa có tài khoản?{" "}
                <Link href="/signup" style={{ color: "#0156FF", fontWeight: 700, textDecoration: "none" }}>
                  Tạo tài khoản mới
                </Link>
              </div>
            </div>

            <div style={formPanelStyle}>
              <div style={{ marginBottom: "26px" }}>
                <h2 style={{ margin: 0, color: "#0f172a", fontSize: "28px", fontWeight: 700 }}>
                  Chào mừng trở lại
                </h2>
                <p style={{ margin: "10px 0 0", color: "#64748b", fontSize: "14px", lineHeight: 1.7 }}>
                  Nhập thông tin tài khoản của bạn để tiếp tục.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "18px" }}>
                  <label htmlFor="username" style={labelStyle}>
                    Tên đăng nhập
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập"
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", gap: "12px" }}>
                    <label htmlFor="password" style={{ ...labelStyle, marginBottom: 0 }}>
                      Mật khẩu
                    </label>
                    <Link href="/forgot-password" style={{ color: "#0156FF", fontSize: "13px", textDecoration: "none", fontWeight: 600 }}>
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      style={{ ...inputStyle, paddingRight: "76px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        border: "none",
                        background: "transparent",
                        color: "#64748b",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        padding: "6px 8px",
                      }}
                    >
                      {showPassword ? "Ẩn" : "Hiện"}
                    </button>
                  </div>
                </div>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "18px",
                    color: "#475569",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "#0156FF" }}
                  />
                  Ghi nhớ đăng nhập
                </label>

                {error ? (
                  <div
                    style={{
                      marginBottom: "18px",
                      border: "1px solid #fecaca",
                      background: "#fff1f2",
                      color: "#be123c",
                      borderRadius: "12px",
                      padding: "12px 14px",
                      fontSize: "13px",
                      lineHeight: 1.6,
                    }}
                  >
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: "52px",
                    border: "none",
                    borderRadius: "12px",
                    background: loading ? "#93c5fd" : "#0156FF",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: loading ? "none" : "0 14px 30px rgba(1, 86, 255, 0.18)",
                  }}
                >
                  {loading ? "Đang xử lý..." : "Đăng nhập"}
                </button>
              </form>

              <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "24px 0 18px" }}>
                <div style={{ height: "1px", background: "#e2e8f0", flex: 1 }} />
                <span style={{ color: "#94a3b8", fontSize: "12px", fontWeight: 600 }}>hoặc</span>
                <div style={{ height: "1px", background: "#e2e8f0", flex: 1 }} />
              </div>

              <p style={{ margin: 0, color: "#64748b", fontSize: "14px", lineHeight: 1.7, textAlign: "center" }}>
                Chưa có tài khoản?{" "}
                <Link href="/signup" style={{ color: "#0156FF", fontWeight: 700, textDecoration: "none" }}>
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
