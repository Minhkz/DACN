"use client";

import { ApiErrorResponse, AuthResponse } from "@/types/auth/AuthResponse";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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

      if (response.data.success) {
        router.replace("/");
        router.refresh();
        return;
      }

      setError(response.data.message || "Đăng nhập thất bại");
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
    <div className="flex min-h-screen items-center justify-center bg-[#F5F2EC] px-4 py-10">
      <div
        className="w-full max-w-[420px] rounded-[20px] border border-[#E0DDD6] bg-white px-9 py-10 shadow-sm"
        style={{ padding: "5px" }}
      >
        {/* Brand */}
        <div className="mb-10 flex items-center gap-2.5">
          <span className="font-serif text-[16px] tracking-tight text-[#1A1A1A]">
            Laptop Shop
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-[28px] font-normal leading-tight tracking-tight text-[#1A1A1A]">
          Chào mừng trở lại
        </h1>
        <p className="mb-9 mt-2 text-[13.5px] font-light leading-relaxed text-[#999]">
          Đăng nhập để tiếp tục mua sắm
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-[11px] font-semibold uppercase tracking-[0.8px] text-[#6B6B6B]"
            >
              Tên đăng nhập
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              className="h-[48px] w-full rounded-xl border border-[#E3E0DA] bg-[#FAFAF8] px-4 text-[14px] text-[#1A1A1A] placeholder:text-[#C0BDB7] outline-none transition-all duration-150 hover:border-[#C8C5BF] focus:border-[#1A1A1A] focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,26,26,0.06)]"
              style={{ marginBottom: "5px" }}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-[11px] font-semibold uppercase tracking-[0.8px] text-[#6B6B6B]"
              >
                Mật khẩu
              </label>
              <Link
                href="/forgot-password"
                className="text-[12px] text-[#8B7355] transition hover:text-[#6B5535]"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="h-[48px] w-full rounded-xl border border-[#E3E0DA] bg-[#FAFAF8] px-4 pr-16 text-[14px] text-[#1A1A1A] placeholder:text-[#C0BDB7] outline-none transition-all duration-150 hover:border-[#C8C5BF] focus:border-[#1A1A1A] focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,26,26,0.06)]"
                style={{ marginBottom: "5px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.6px] text-[#AAA] transition hover:bg-[#F0EDE8] hover:text-[#555]"
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
          </div>

          {/* Remember me — custom checkbox */}
          <label className="flex cursor-pointer items-center gap-2.5 pt-0.5">
            <div className="relative flex shrink-0 items-center">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="h-[18px] w-[18px] cursor-pointer appearance-none rounded-[5px] border-2 border-[#D5D2CB] bg-white transition checked:border-[#1A1A1A] checked:bg-[#1A1A1A]"
              />
              {isChecked && (
                <svg
                  className="pointer-events-none absolute left-[3px] top-[3px]"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span
              className="select-none text-[13px] text-[#777]"
              style={{ marginBottom: "5px" }}
            >
              Ghi nhớ đăng nhập
            </span>
          </label>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 5v3.5M8 11h.01"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex h-[50px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#1A1A1A] text-[14.5px] font-medium tracking-[0.2px] text-white transition-all duration-150 hover:bg-[#2D2D2D] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#C5C2BB]"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#EEECE8]" />
          <span className="text-[11px] uppercase tracking-[0.6px] text-[#C0BDB7]">
            hoặc
          </span>
          <div className="h-px flex-1 bg-[#EEECE8]" />
        </div>

        {/* Register */}
        <p className="text-center text-[13px] text-[#999]">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="border-b border-[#1A1A1A] pb-px font-medium text-[#1A1A1A] transition hover:border-[#555] hover:text-[#555]"
          >
            Tạo tài khoản
          </Link>
        </p>
      </div>
    </div>
  );
}
