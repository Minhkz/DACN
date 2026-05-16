"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Sidebar from "./Sidebar";
import DashboardTab from "./DashboardTab";
import OrdersTab from "./OrdersTab";
import ProfileTab from "./ProfileTab";
import NotificationsTab from "./NotificationsTab";
import LogoutModal from "./LogoutModal";

import { UserProfileTab } from "./types";
import UserDetailType from "@/types/user/UserDetailType";
import { me } from "@/services/user/UserService";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<UserProfileTab>("dashboard");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<UserDetailType>({
    queryKey: ["user"],
    queryFn: me,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-gray-500 font-medium">
          Đang tải thông tin người dùng...
        </div>
      );
    }

    if (isError || !user) {
      return (
        <div className="text-red-500 font-medium">
          Không thể tải thông tin người dùng
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab user={user} onChangeTab={(tab) => setActiveTab(tab)} />
        );

      case "orders":
        return <OrdersTab />;

      case "profile":
        return <ProfileTab user={user} />;

      case "notifications":
        return <NotificationsTab />;

      default:
        return (
          <DashboardTab user={user} onChangeTab={(tab) => setActiveTab(tab)} />
        );
    }
  };

  return (
    <div className="container-global min-h-screen  font-sans text-gray-800 flex flex-col justify-between">
      <LogoutModal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />

      <main className="w-full flex-grow" style={{ padding: "40px 16px" }}>
        <div
          className="max-w-7xl mx-auto flex flex-col lg:flex-row w-full"
          style={{ gap: "32px" }}
        >
          <Sidebar
            user={user}
            activeTab={activeTab}
            onChangeTab={(tab) => setActiveTab(tab)}
            onLogout={() => setIsLogoutModalOpen(true)}
          />

          <section className="flex-1 w-full min-w-0">
            <div
              className="bg-white rounded-2xl border border-gray-200 shadow-sm w-full"
              style={{ padding: "32px", minHeight: "650px" }}
            >
              {renderContent()}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
