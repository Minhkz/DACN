import React from "react";
import {
  PackageCheck,
  BadgePercent,
  CircleCheckBig,
  Settings,
  CheckCheck,
} from "lucide-react";
import { notifications } from "./data";
import { NotificationType } from "./types";

const tabs = ["Tất cả (2)", "Đơn hàng", "Khuyến mãi", "Hệ thống"];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "order":
      return {
        Icon: PackageCheck,
        className: "bg-blue-100 text-blue-600",
      };

    case "promotion":
      return {
        Icon: BadgePercent,
        className: "bg-rose-100 text-rose-600",
      };

    case "success":
      return {
        Icon: CircleCheckBig,
        className: "bg-emerald-100 text-emerald-600",
      };

    case "system":
      return {
        Icon: Settings,
        className: "bg-gray-100 text-gray-600",
      };

    default:
      return {
        Icon: Settings,
        className: "bg-gray-100 text-gray-600",
      };
  }
};

export default function NotificationsTab() {
  return (
    <div className="animate-in fade-in duration-300 w-full">
      <div
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center"
        style={{ marginBottom: "24px", gap: "12px" }}
      >
        <h2 className="text-2xl font-bold text-gray-900">Thông báo của bạn</h2>

        <button
          type="button"
          className="text-blue-600 font-bold text-sm hover:underline flex items-center"
          style={{ gap: "8px" }}
        >
          <CheckCheck size={18} strokeWidth={2.4} />
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <div
        className="flex border-b border-gray-200 flex-wrap"
        style={{ gap: "24px", marginBottom: "24px" }}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={
              index === 0
                ? "text-blue-600 font-bold border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-900"
            }
            style={{ paddingBottom: "12px" }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col" style={{ gap: "16px" }}>
        {notifications.map((noti) => {
          const { Icon, className } = getNotificationIcon(noti.type);

          return (
            <div
              key={noti.id}
              className={`rounded-xl border flex items-start hover:shadow-sm transition-shadow ${
                noti.unread
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-gray-200"
              }`}
              style={{ padding: "20px" }}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${className}`}
                style={{ marginRight: "16px" }}
              >
                <Icon size={22} strokeWidth={2.3} />
              </div>

              <div className="flex-1 min-w-0">
                <h4
                  className={`text-lg font-bold flex items-center ${
                    noti.unread ? "text-gray-900" : "text-gray-600"
                  }`}
                  style={{ marginBottom: "6px", gap: "8px" }}
                >
                  {noti.unread && (
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                  )}

                  <span>{noti.title}</span>
                </h4>

                <p
                  className="text-gray-600 text-sm whitespace-pre-line"
                  style={{ marginBottom: "8px" }}
                >
                  {noti.desc}
                </p>

                {noti.unread && (
                  <button
                    type="button"
                    className="text-blue-600 text-sm font-bold hover:underline"
                  >
                    Xem chi tiết
                  </button>
                )}
              </div>

              <span
                className="text-sm text-blue-600 font-bold whitespace-nowrap hidden sm:block"
                style={{ marginLeft: "16px" }}
              >
                {noti.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
