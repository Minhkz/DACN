import React from "react";
import {
  LayoutDashboard,
  PackageSearch,
  UserRound,
  Bell,
  LogOut,
} from "lucide-react";

import { UserProfileTab } from "./types";
import UserDetailType from "@/types/user/UserDetailType";

type Props = {
  user?: UserDetailType;
  activeTab: UserProfileTab;
  onChangeTab: (tab: UserProfileTab) => void;
  onLogout: () => void;
};

const menuItems = [
  {
    id: "dashboard" as UserProfileTab,
    label: "Tổng quan tài khoản",
    icon: LayoutDashboard,
  },
  {
    id: "orders" as UserProfileTab,
    label: "Đơn hàng của tôi",
    icon: PackageSearch,
  },
  {
    id: "profile" as UserProfileTab,
    label: "Thông tin cá nhân",
    icon: UserRound,
  },
  {
    id: "notifications" as UserProfileTab,
    label: "Thông báo",
    icon: Bell,
  },
];

export default function Sidebar({
  user,
  activeTab,
  onChangeTab,
  onLogout,
}: Props) {
  const avatarLetter =
    user?.fullName?.charAt(0).toUpperCase() ||
    user?.username?.charAt(0).toUpperCase() ||
    "U";

  return (
    <aside className="w-full lg:w-[280px] flex-shrink-0">
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-sm"
        style={{ padding: "24px" }}
      >
        <div
          className="flex items-center border-b border-gray-200"
          style={{ paddingBottom: "24px", marginBottom: "24px" }}
        >
          <div
            className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold overflow-hidden"
            style={{ marginRight: "16px" }}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName || user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              avatarLetter
            )}
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-lg truncate">
              {user?.fullName || user?.username || "Người dùng"}
            </h3>

            <button
              type="button"
              onClick={() => onChangeTab("profile")}
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              Sửa hồ sơ
            </button>
          </div>
        </div>

        <nav className="flex flex-col" style={{ gap: "8px" }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeTab(item.id)}
                className={`w-full flex items-center text-left font-semibold rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                style={{ padding: "14px 16px" }}
              >
                <Icon
                  size={22}
                  strokeWidth={2.2}
                  style={{ marginRight: "12px" }}
                />

                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
