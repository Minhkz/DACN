import React from "react";
import { Heart, PackageSearch, Pencil } from "lucide-react";

import { UserProfileTab } from "./types";
import UserDetailType from "@/types/user/UserDetailType";
import { useAppSelector } from "@/store/hooks";

type Props = {
  user: UserDetailType;
  onChangeTab: (tab: UserProfileTab) => void;
};

export default function DashboardTab({ user, onChangeTab }: Props) {
  const wishlistCount = useAppSelector(
    (s) => s.wishlist.wishlist?.items?.length ?? 0,
  );
  return (
    <div className="animate-in fade-in duration-300 w-full">
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200"
        style={{ paddingBottom: "16px", marginBottom: "24px", gap: "16px" }}
      >
        <h2 className="text-2xl font-bold text-gray-900">
          Tổng quan tài khoản
        </h2>

        <button
          type="button"
          onClick={() => onChangeTab("profile")}
          className="bg-blue-600 text-white text-sm font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center"
          style={{ padding: "10px 18px", gap: "8px" }}
        >
          <Pencil size={18} strokeWidth={2.4} />
          Chỉnh sửa hồ sơ
        </button>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        style={{ gap: "20px", marginBottom: "32px" }}
      >
        <div
          className="bg-gray-50 border border-gray-200 rounded-xl"
          style={{ padding: "20px" }}
        >
          <h3
            className="font-bold text-sm text-gray-500"
            style={{ marginBottom: "16px" }}
          >
            THÔNG TIN HỒ SƠ
          </h3>

          <p className="text-sm font-medium" style={{ marginBottom: "8px" }}>
            Tên: {user.fullName || "Chưa cập nhật"}
          </p>

          <p className="text-sm font-medium" style={{ marginBottom: "8px" }}>
            Email: {user.email || "Chưa cập nhật"}
          </p>

          <p className="text-sm font-medium">
            Điện thoại: {user.phone || "Chưa cập nhật"}
          </p>
        </div>

        <div
          className="bg-gray-50 border border-gray-200 rounded-xl flex flex-col justify-between"
          style={{ padding: "20px" }}
        >
          <div>
            <h3
              className="font-bold text-sm text-gray-500"
              style={{ marginBottom: "16px" }}
            >
              ĐƠN HÀNG GẦN NHẤT
            </h3>

            <p
              className="text-sm font-bold text-gray-900"
              style={{ marginBottom: "8px" }}
            >
              #ORD3933
            </p>

            <p className="text-sm font-medium text-yellow-700">
              Trạng thái: Đang giao
            </p>
          </div>

          <button
            type="button"
            onClick={() => onChangeTab("orders")}
            className="text-sm font-bold text-blue-600 text-left hover:underline"
            style={{ marginTop: "16px" }}
          >
            Xem chi tiết
          </button>
        </div>

        <div
          className="bg-gray-50 border border-gray-200 rounded-xl text-center"
          style={{ padding: "20px" }}
        >
          <h3
            className="font-bold text-sm text-gray-500 text-left"
            style={{ marginBottom: "8px" }}
          >
            SẢN PHẨM YÊU THÍCH
          </h3>

          <div
            className="flex items-center justify-center text-gray-900"
            style={{ margin: "16px 0", gap: "12px" }}
          >
            <Heart
              size={42}
              fill="currentColor"
              strokeWidth={2.2}
              className="text-rose-500"
            />
            <span className="text-4xl font-bold">{wishlistCount}</span>
          </div>

          <p className="text-xs text-gray-500">sản phẩm trong danh sách</p>
        </div>
      </div>

      <h3
        className="text-lg font-bold text-gray-900"
        style={{ marginBottom: "16px" }}
      >
        Hành động nhanh
      </h3>

      <div className="flex flex-wrap" style={{ gap: "16px" }}>
        <button
          type="button"
          onClick={() => onChangeTab("orders")}
          className="bg-white border border-gray-200 text-gray-800 font-bold rounded-lg flex items-center shadow-sm hover:bg-gray-50 transition-colors"
          style={{ padding: "12px 20px", gap: "10px" }}
        >
          <PackageSearch size={20} strokeWidth={2.3} />
          Xem toàn bộ đơn hàng
        </button>

        <button
          type="button"
          className="bg-white border border-gray-200 text-gray-800 font-bold rounded-lg flex items-center shadow-sm hover:bg-gray-50 transition-colors"
          style={{ padding: "12px 20px", gap: "10px" }}
        >
          <Heart
            size={20}
            strokeWidth={2.3}
            fill="currentColor"
            className="text-rose-500"
          />
          Quản lý yêu thích
        </button>
      </div>
    </div>
  );
}
