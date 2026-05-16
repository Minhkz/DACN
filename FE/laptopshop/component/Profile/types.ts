export type UserProfileTab =
  | "dashboard"
  | "orders"
  | "profile"
  | "notifications";

export type OrderItem = {
  id: string;
  date: string;
  status: string;
  total: string;
  statusClassName: string;
  buttonClassName?: string;
};

export type NotificationType = "order" | "promotion" | "success" | "system";

export type NotificationItem = {
  id: number;
  type: NotificationType;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
};

export type SidebarItem = {
  id: UserProfileTab;
  label: string;
  icon: string;
};
