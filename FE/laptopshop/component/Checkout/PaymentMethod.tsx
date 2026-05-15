"use client";

import React from "react";

export type PaymentMethodId = "cod" | "banking" | "ewallet";

interface PaymentOption {
  id: PaymentMethodId;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface PaymentMethodProps {
  selected: PaymentMethodId;
  onChange: (id: PaymentMethodId) => void;
}

const paymentOptions: PaymentOption[] = [
  {
    id: "cod",
    label: "Thanh toán khi nhận hàng (COD)",
    description: "Trả tiền mặt khi nhận hàng tại nhà",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="2"
          y="6"
          width="20"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path d="M2 10h20" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="7" cy="15" r="1.5" fill="currentColor" />
        <path
          d="M12 15h5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "banking",
    label: "Chuyển khoản Ngân hàng",
    description: "Internet Banking / QR Code",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="2"
          y="5"
          width="20"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M2 9h20M7 14h.01M11 14h.01M15 14h2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path d="M12 2l-5 3h10l-5-3z" fill="currentColor" opacity=".4" />
      </svg>
    ),
  },
  {
    id: "ewallet",
    label: "Ví điện tử",
    description: "MoMo, ZaloPay, VNPAY",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="5"
          y="2"
          width="14"
          height="20"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <circle cx="12" cy="17" r="1.5" fill="currentColor" />
        <rect
          x="8"
          y="6"
          width="8"
          height="6"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
];

export default function PaymentMethod({
  selected,
  onChange,
}: PaymentMethodProps) {
  return (
    <section>
      <h2
        className="text-lg font-bold text-slate-900"
        style={{ marginBottom: "16px" }}
      >
        2. Phương thức thanh toán
      </h2>

      <div className="flex flex-col" style={{ gap: "12px" }}>
        {paymentOptions.map((option) => {
          const isActive = selected === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`w-full text-left rounded-xl border-2 flex items-center transition-all ${
                isActive
                  ? "border-[#0156FF] bg-[#f0f6ff]"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
              style={{ padding: "18px 20px" }}
            >
              <span
                className={`flex-shrink-0 flex items-center justify-center rounded-full border-2 transition-all ${
                  isActive
                    ? "border-[#0156FF] bg-[#0156FF]"
                    : "border-slate-300 bg-white"
                }`}
                style={{ width: "20px", height: "20px", marginRight: "16px" }}
              >
                {isActive && (
                  <span
                    className="block rounded-full bg-white"
                    style={{ width: "8px", height: "8px" }}
                  />
                )}
              </span>

              <span
                className={`flex-shrink-0 flex items-center justify-center rounded-xl transition-colors ${
                  isActive
                    ? "text-[#0156FF] bg-blue-100"
                    : "text-slate-400 bg-slate-50"
                }`}
                style={{ width: "42px", height: "42px", marginRight: "16px" }}
              >
                {option.icon}
              </span>

              <div>
                <p
                  className={`font-semibold text-sm md:text-base ${
                    isActive ? "text-slate-900" : "text-slate-700"
                  }`}
                >
                  {option.label}
                </p>

                <p
                  className="text-slate-400 text-xs"
                  style={{ marginTop: "2px" }}
                >
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
