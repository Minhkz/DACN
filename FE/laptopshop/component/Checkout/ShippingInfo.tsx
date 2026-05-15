"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { me, updateMyAddress } from "@/services/user/UserService";
import { notify } from "@/utils/notify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ShippingInfoProps = {
  onAddressChange?: (address: string) => void;
};

export default function ShippingInfo({ onAddressChange }: ShippingInfoProps) {
  const userId = useAppSelector((state) => state.auth.userId);

  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [addressInput, setAddressInput] = useState("");

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: me,
    enabled: !!userId,
  });

  useEffect(() => {
    if (user?.address) {
      setAddressInput(user.address);
      onAddressChange?.(user.address);
    }
  }, [user?.address, onAddressChange]);

  const updateAddressMutation = useMutation({
    mutationFn: updateMyAddress,

    onSuccess: async (_, newAddress) => {
      notify("success", "Đã cập nhật địa chỉ giao hàng.");

      onAddressChange?.(newAddress);

      setEditing(false);

      await queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },

    onError: (error) => {
      console.error("Update address error:", error);
      notify("error", "Không thể cập nhật địa chỉ. Vui lòng thử lại.");
    },
  });

  const handleSaveAddress = () => {
    const newAddress = addressInput.trim();

    if (!newAddress) {
      notify("info", "Địa chỉ giao hàng không được để trống.");
      return;
    }

    updateAddressMutation.mutate(newAddress);
  };

  if (!userId) {
    return (
      <section style={{ marginBottom: "40px" }}>
        <h2
          className="text-lg font-bold text-slate-900"
          style={{ marginBottom: "16px" }}
        >
          1. Thông tin giao hàng
        </h2>

        <div
          className="bg-white border border-slate-200 rounded-2xl"
          style={{
            padding: "24px",
            boxShadow: "0 4px 16px rgba(15,23,42,0.05)",
          }}
        >
          <p className="text-sm text-slate-500">
            Vui lòng đăng nhập để lấy thông tin giao hàng.
          </p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section style={{ marginBottom: "40px" }}>
        <h2
          className="text-lg font-bold text-slate-900"
          style={{ marginBottom: "16px" }}
        >
          1. Thông tin giao hàng
        </h2>

        <div
          className="bg-white border border-slate-200 rounded-2xl"
          style={{
            padding: "24px",
            boxShadow: "0 4px 16px rgba(15,23,42,0.05)",
          }}
        >
          <div
            style={{
              height: "22px",
              width: "260px",
              background: "#e2e8f0",
              borderRadius: "8px",
              marginBottom: "12px",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />

          <div
            style={{
              height: "16px",
              width: "420px",
              maxWidth: "100%",
              background: "#e2e8f0",
              borderRadius: "8px",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />

          <style>{`
            @keyframes pulse {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: .5;
              }
            }
          `}</style>
        </div>
      </section>
    );
  }

  if (isError || !user) {
    return (
      <section style={{ marginBottom: "40px" }}>
        <h2
          className="text-lg font-bold text-slate-900"
          style={{ marginBottom: "16px" }}
        >
          1. Thông tin giao hàng
        </h2>

        <div
          className="bg-white border border-slate-200 rounded-2xl"
          style={{
            padding: "24px",
            boxShadow: "0 4px 16px rgba(15,23,42,0.05)",
          }}
        >
          <p className="text-sm text-red-500">
            Không thể tải thông tin giao hàng.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ marginBottom: "40px" }}>
      <h2
        className="text-lg font-bold text-slate-900"
        style={{ marginBottom: "16px" }}
      >
        1. Thông tin giao hàng
      </h2>

      <div
        className="bg-white border border-slate-200 rounded-2xl flex items-start"
        style={{
          padding: "24px",
          boxShadow: "0 4px 16px rgba(15,23,42,0.05)",
        }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-xl bg-blue-50"
          style={{ width: "44px", height: "44px", marginRight: "18px" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              fill="#0156FF"
              fillOpacity=".15"
              stroke="#0156FF"
              strokeWidth="1.6"
            />
            <circle cx="12" cy="9" r="2.5" fill="#0156FF" />
          </svg>
        </div>

        <div className="flex-1">
          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
            style={{ marginBottom: "8px" }}
          >
            <h3 className="text-base font-bold text-slate-900">
              {user.fullName || user.username || "Người dùng"}

              <span
                className="text-slate-400 font-medium"
                style={{ marginLeft: "10px" }}
              >
                {user.phone || "Chưa có số điện thoại"}
              </span>
            </h3>

            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setAddressInput(user.address ?? "");
                  setEditing(true);
                }}
                className="text-[#0156FF] text-sm font-semibold hover:underline self-start sm:self-auto"
                style={{ marginTop: "6px" }}
              >
                Thay đổi
              </button>
            )}
          </div>

          {!editing ? (
            <p
              className="text-slate-600 text-sm"
              style={{ marginBottom: "8px" }}
            >
              {user.address || "Chưa có địa chỉ giao hàng"}
            </p>
          ) : (
            <div style={{ marginBottom: "12px" }}>
              <textarea
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="Nhập địa chỉ giao hàng"
                className="w-full border border-slate-300 rounded-xl text-sm text-slate-700 outline-none focus:border-[#0156FF]"
                style={{
                  padding: "12px 14px",
                  minHeight: "84px",
                  resize: "vertical",
                }}
              />

              <div
                className="flex items-center gap-2"
                style={{ marginTop: "10px" }}
              >
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  disabled={updateAddressMutation.isPending}
                  className={`text-white text-sm font-semibold rounded-lg ${
                    updateAddressMutation.isPending
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-[#0156FF] hover:bg-blue-700"
                  }`}
                  style={{ padding: "8px 16px" }}
                >
                  {updateAddressMutation.isPending ? "Đang lưu..." : "Lưu"}
                </button>

                <button
                  type="button"
                  disabled={updateAddressMutation.isPending}
                  onClick={() => {
                    setAddressInput(user.address ?? "");
                    setEditing(false);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-lg"
                  style={{ padding: "8px 16px" }}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          <div
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 rounded-lg"
            style={{ padding: "4px 10px" }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            Giao giờ hành chính
          </div>
        </div>
      </div>
    </section>
  );
}
