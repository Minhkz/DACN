import { NotificationItem, OrderItem, SidebarItem } from "./types";

export const sidebarItems: SidebarItem[] = [
  { id: "dashboard", label: "Tổng quan tài khoản", icon: "dashboard" },
  { id: "orders", label: "Đơn hàng của tôi", icon: "orders" },
  { id: "profile", label: "Thông tin cá nhân", icon: "profile" },
  { id: "notifications", label: "Thông báo", icon: "notifications" },
];

export const orders: OrderItem[] = [
  {
    id: "#ORD-221130",
    date: "25/12/2026\n14:30",
    status: "Đang giao hàng",
    total: "6.000.000đ",
    statusClassName: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "#ORD-123456",
    date: "22/11/2026\n09:15",
    status: "Đã hoàn thành",
    total: "35.000.000đ",
    statusClassName: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "#ORD-874563",
    date: "10/02/2026\n16:45",
    status: "Đã hủy",
    total: "1.250.000đ",
    statusClassName: "bg-red-100 text-red-700",
    buttonClassName: "bg-gray-100 text-gray-600 hover:bg-gray-200",
  },
  {
    id: "#ORD-546328",
    date: "15/01/2026\n08:20",
    status: "Đã hoàn thành",
    total: "12.500.000đ",
    statusClassName: "bg-emerald-100 text-emerald-700",
  },
];

export const notifications: NotificationItem[] = [
  {
    id: 1,
    type: "order",
    title: "Đơn hàng 1 đang được giao!",
    desc: "Đơn hàng của bạn đã được bàn giao cho đơn vị vận chuyển.\nVui lòng chú ý điện thoại để nhận hàng.",
    time: "2 giờ trước",
    unread: true,
  },
  {
    id: 2,
    type: "promotion",
    title: "Khuyến mãi cuối tuần: Giảm ngay 20% Laptop Gaming",
    desc: "Nhập mã GAMING20 để được giảm giá lên đến 2 triệu đồng.\nClick để xem chi tiết sản phẩm áp dụng!",
    time: "Hôm qua, 15:30",
    unread: true,
  },
  {
    id: 3,
    type: "success",
    title: "Giao hàng thành công",
    desc: "Đơn hàng 1 đã được giao thành công.\nĐừng quên đánh giá sản phẩm để nhận xu nhé!",
    time: "03/05/2026",
    unread: false,
  },
  {
    id: 4,
    type: "system",
    title: "Cập nhật chính sách bảo mật",
    desc: "Chúng tôi đã cập nhật lại điều khoản dịch vụ và chính sách bảo mật. Áp dụng từ 01/05/2026.",
    time: "28/04/2026",
    unread: false,
  },
];
