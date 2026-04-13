"use client";

import Header from "@/component/Header/Header";
import Footer from "@/component/Footer/Footer";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";

type AuthResponse = {
  success?: boolean;
  message?: string;
};

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
};

type RegisterForm = RegisterPayload & {
  confirmPassword: string;
};

const initialForm: RegisterForm = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  phone: "",
  address: "",
};

const fieldWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const labelStyle: React.CSSProperties = {
  color: "#334155",
  fontSize: "13px",
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "50px",
  border: "1px solid #d6e0ef",
  borderRadius: "12px",
  padding: "0 16px",
  fontSize: "14px",
  color: "#1f2937",
  background: "#ffffff",
  outline: "none",
};

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    const payload: RegisterPayload = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    };

    try {
      setLoading(true);
      const res = await axios.post<AuthResponse>("/api/auth/register", payload);
      setSuccessMessage(res.data?.message || "Đăng ký tài khoản thành công.");
      setForm(initialForm);
      window.setTimeout(() => {
        router.push("/signin");
      }, 1200);
    } catch (error) {
      if (axios.isAxiosError<AuthResponse>(error)) {
        setErrorMessage(
          error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.",
        );
      } else {
        setErrorMessage("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", background: "#F5F7FF" }}>
        <section className="container-global" style={{ padding: "48px 0 64px" }}>
          <div style={{ marginBottom: "20px", color: "#64748b", fontSize: "14px" }}>
            <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
              Trang chủ
            </Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#0156FF", fontWeight: 600 }}>Đăng ký</span>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "28px",
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                flex: "1 1 330px",
                background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                border: "1px solid #dbe7ff",
                borderRadius: "18px",
                padding: "34px",
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
              }}
            >
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
                Tài khoản mới
              </div>

              <h1 style={{ margin: 0, fontSize: "38px", lineHeight: 1.2, color: "#0f172a", fontWeight: 700 }}>
                Tạo tài khoản đồng bộ với trải nghiệm mua sắm của website
              </h1>

              <p style={{ margin: "18px 0 28px", color: "#475569", fontSize: "15px", lineHeight: 1.8 }}>
                Giao diện đăng ký được làm đầy đặn hơn, dễ nhìn hơn và ăn nhập với
                cart, wishlist cũng như phần header, footer của toàn bộ shop.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "14px",
                }}
              >
                {[
                  "Đặt hàng và theo dõi đơn nhanh hơn",
                  "Lưu sản phẩm yêu thích dễ dàng",
                  "Nhận khuyến mãi và thông báo mới",
                  "Quản lý thông tin cá nhân thuận tiện",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      border: "1px solid #e5edf8",
                      background: "#ffffff",
                      borderRadius: "14px",
                      padding: "16px",
                      color: "#475569",
                      fontSize: "14px",
                      lineHeight: 1.7,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                flex: "1 1 560px",
                background: "#ffffff",
                border: "1px solid #e3ebf6",
                borderRadius: "18px",
                padding: "34px",
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
              }}
            >
              <div style={{ marginBottom: "26px" }}>
                <h2 style={{ margin: 0, color: "#0f172a", fontSize: "28px", fontWeight: 700 }}>
                  Đăng ký tài khoản
                </h2>
                <p style={{ margin: "10px 0 0", color: "#64748b", fontSize: "14px", lineHeight: 1.7 }}>
                  Điền đầy đủ thông tin bên dưới để tạo tài khoản mới.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "18px",
                  }}
                >
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle}>Username</label>
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      placeholder="Nhập username"
                      style={inputStyle}
                    />
                  </div>

                  <div style={fieldWrapStyle}>
                    <label style={labelStyle}>Họ và tên</label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Nhập họ và tên"
                      style={inputStyle}
                    />
                  </div>

                  <div style={fieldWrapStyle}>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="Nhập email"
                      style={inputStyle}
                    />
                  </div>

                  <div style={fieldWrapStyle}>
                    <label style={labelStyle}>Số điện thoại</label>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="Nhập số điện thoại"
                      style={inputStyle}
                    />
                  </div>

                  <div style={fieldWrapStyle}>
                    <label style={labelStyle}>Mật khẩu</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      placeholder="Nhập mật khẩu"
                      style={inputStyle}
                    />
                  </div>

                  <div style={fieldWrapStyle}>
                    <label style={labelStyle}>Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Nhập lại mật khẩu"
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ ...fieldWrapStyle, gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Địa chỉ</label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Nhập địa chỉ"
                      style={{
                        ...inputStyle,
                        minHeight: "120px",
                        padding: "14px 16px",
                        resize: "vertical",
                      }}
                    />
                  </div>
                </div>

                {errorMessage ? (
                  <div
                    style={{
                      marginTop: "18px",
                      border: "1px solid #fecaca",
                      background: "#fff1f2",
                      color: "#be123c",
                      borderRadius: "12px",
                      padding: "12px 14px",
                      fontSize: "13px",
                      lineHeight: 1.6,
                    }}
                  >
                    {errorMessage}
                  </div>
                ) : null}

                {successMessage ? (
                  <div
                    style={{
                      marginTop: "18px",
                      border: "1px solid #bbf7d0",
                      background: "#f0fdf4",
                      color: "#15803d",
                      borderRadius: "12px",
                      padding: "12px 14px",
                      fontSize: "13px",
                      lineHeight: 1.6,
                    }}
                  >
                    {successMessage}
                  </div>
                ) : null}

                <div style={{ marginTop: "22px" }}>
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
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                  </button>
                </div>
              </form>

              <p style={{ margin: "20px 0 0", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
                Đã có tài khoản?{" "}
                <Link href="/signin" style={{ color: "#0156FF", fontWeight: 700, textDecoration: "none" }}>
                  Đăng nhập
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
