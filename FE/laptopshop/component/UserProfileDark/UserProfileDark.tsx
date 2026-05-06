"use client";

import React, { useState } from "react";

export default function UserProfileLight() {
  // Quản lý trạng thái chuyển đổi giữa các tab
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // ==========================================
  // 1. GIAO DIỆN: SIDEBAR (MENU BÊN TRÁI)
  // ==========================================
  const renderSidebar = () => {
    const menuItems = [
      { id: "dashboard", label: "Tổng quan tài khoản", icon: "📊" },
      { id: "orders", label: "Đơn hàng của tôi", icon: "📦" },
      { id: "profile", label: "Thông tin cá nhân", icon: "👤" },
      { id: "notifications", label: "Thông báo (2)", icon: "🔔" },
    ];

    return (
      <div className="w-full lg:w-[280px] flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm" style={{ padding: '24px' }}>
          
          {/* Thông tin User */}
          <div className="flex items-center border-b border-gray-200" style={{ paddingBottom: '24px', marginBottom: '24px' }}>
            <div className="w-14 h-14 rounded-full bg-[#1A73E8] flex items-center justify-center text-white text-xl font-bold" style={{ marginRight: '16px' }}>
              A
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Nguyễn Văn A</h3>
              <p className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" onClick={() => setActiveTab("profile")}>
                ✏️ Sửa hồ sơ
              </p>
            </div>
          </div>

          {/* Danh sách Menu */}
          <nav className="flex flex-col" style={{ gap: '8px' }}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center text-left font-semibold rounded-xl transition-all ${
                  activeTab === item.id 
                    ? "bg-[#1A73E8] text-white shadow-md shadow-blue-500/20" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                style={{ padding: '14px 16px' }}
              >
                <span className="text-xl" style={{ marginRight: '12px' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}

            {/* Nút Đăng xuất */}
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full flex items-center text-left font-bold text-[#EF4444] hover:bg-red-50 rounded-xl transition-all"
              style={{ padding: '14px 16px', marginTop: '16px' }}
            >
              <span className="text-xl" style={{ marginRight: '12px' }}>🚪</span>
              Đăng xuất
            </button>
          </nav>
        </div>
      </div>
    );
  };

  // ==========================================
  // 2. GIAO DIỆN: TỔNG QUAN TÀI KHOẢN
  // ==========================================
  const renderDashboard = () => (
    <div className="animate-in fade-in duration-300 w-full">
      <div className="flex justify-between items-center border-b border-gray-200" style={{ paddingBottom: '16px', marginBottom: '24px' }}>
        <h2 className="text-2xl font-bold text-gray-900">Tổng quan tài khoản (My Dashboard)</h2>
        <button type="button" onClick={() => setActiveTab("profile")} className="bg-[#1A73E8] text-white text-sm font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors" style={{ padding: '8px 16px' }}>
          ✏️ Chỉnh sửa hồ sơ
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '20px', marginBottom: '32px' }}>
        {/* Thẻ Thông tin hồ sơ */}
        <div className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl flex flex-col justify-center" style={{ padding: '20px' }}>
          <h3 className="font-bold text-sm text-gray-500" style={{ marginBottom: '16px' }}>THÔNG TIN HỒ SƠ</h3>
          <p className="text-sm font-medium" style={{ marginBottom: '8px' }}>Tên: Nguyễn Văn A</p>
          <p className="text-sm font-medium" style={{ marginBottom: '8px' }}>Email: nva@email.com</p>
          <p className="text-sm font-medium">Điện thoại: 0123...456</p>
        </div>

        {/* Thẻ Đơn hàng gần nhất */}
        <div className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl flex flex-col justify-between" style={{ padding: '20px' }}>
          <div>
            <h3 className="font-bold text-sm text-gray-500" style={{ marginBottom: '16px' }}>ĐƠN HÀNG GẦN NHẤT</h3>
            <p className="text-sm font-bold text-gray-900" style={{ marginBottom: '8px' }}>#ORD3933</p>
            <p className="text-sm font-medium text-[#D97706]">Trạng thái: Đang giao</p>
          </div>
          <button type="button" onClick={() => setActiveTab("orders")} className="text-sm font-bold text-[#1A73E8] text-left hover:underline" style={{ marginTop: '16px' }}>Xem chi tiết</button>
        </div>

        {/* Thẻ Sản phẩm yêu thích */}
        <div className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl flex flex-col items-center justify-center text-center" style={{ padding: '20px' }}>
          <h3 className="font-bold text-sm text-gray-500 w-full text-left" style={{ marginBottom: '8px' }}>SẢN PHẨM YÊU THÍCH</h3>
          <div className="text-4xl font-bold flex items-center text-gray-900" style={{ gap: '8px', margin: '16px 0' }}>
            ❤️ 5
          </div>
          <p className="text-xs text-gray-500">sản phẩm trong danh sách</p>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900" style={{ marginBottom: '16px' }}>Hành động nhanh</h3>
      <div className="flex flex-wrap" style={{ gap: '16px' }}>
        <button type="button" onClick={() => setActiveTab("orders")} className="bg-white border border-gray-200 text-gray-800 font-bold rounded-lg flex items-center shadow-sm hover:bg-gray-50 transition-colors" style={{ padding: '12px 20px' }}>
          <span style={{ marginRight: '8px' }}>📦</span> Xem toàn bộ Đơn hàng
        </button>
        <button type="button" className="bg-white border border-gray-200 text-gray-800 font-bold rounded-lg flex items-center shadow-sm hover:bg-gray-50 transition-colors" style={{ padding: '12px 20px' }}>
          <span style={{ marginRight: '8px' }}>❤️</span> Quản lý Danh sách yêu thích
        </button>
      </div>
    </div>
  );

  // ==========================================
  // 3. GIAO DIỆN: ĐƠN HÀNG CỦA TÔI
  // ==========================================
  const renderOrders = () => {
    const orders = [
      { id: "#ORD-221130", date: "25/12/2026\n14:30", status: "Đang giao hàng", total: "6.000.000đ", statusColor: "#D97706", statusBg: "#FEF3C7" },
      { id: "#ORD-123456", date: "22/11/2026\n09:15", status: "Đã hoàn thành", total: "35.000.000đ", statusColor: "#059669", statusBg: "#D1FAE5" },
      { id: "#ORD-874563", date: "10/02/2026\n16:45", status: "Đã hủy", total: "1.250.000đ", statusColor: "#DC2626", statusBg: "#FEE2E2", btnBg: "#F3F4F6", btnText: "#4B5563" },
      { id: "#ORD-546328", date: "15/01/2026\n08:20", status: "Đã hoàn thành", total: "12.500.000đ", statusColor: "#059669", statusBg: "#D1FAE5" },
    ];

    return (
      <div className="animate-in fade-in duration-300 w-full">
        <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '24px' }}>Đơn hàng của tôi</h2>
        
        {/* Bộ lọc */}
        <div className="flex border-b border-gray-200 w-full flex-wrap text-sm sm:text-base" style={{ gap: '24px', marginBottom: '24px' }}>
          <button type="button" className="text-[#1A73E8] font-bold border-b-2 border-[#1A73E8]" style={{ paddingBottom: '12px' }}>Tất cả</button>
          <button type="button" className="text-gray-500 hover:text-gray-900" style={{ paddingBottom: '12px' }}>Chờ xác nhận</button>
          <button type="button" className="text-gray-500 hover:text-gray-900" style={{ paddingBottom: '12px' }}>Đang giao</button>
          <button type="button" className="text-gray-500 hover:text-gray-900" style={{ paddingBottom: '12px' }}>Đã hoàn thành</button>
          <button type="button" className="text-gray-500 hover:text-gray-900" style={{ paddingBottom: '12px' }}>Đã hủy</button>
        </div>

        {/* Tiêu đề bảng */}
        <div className="hidden md:flex text-gray-500 font-bold text-sm w-full" style={{ marginBottom: '12px', padding: '0 20px' }}>
          <div className="w-[150px]">Mã đơn hàng</div>
          <div className="w-[150px]">Thời gian đặt</div>
          <div className="w-[200px]">Trạng thái</div>
          <div className="flex-1">Tổng cộng</div>
        </div>

        {/* Danh sách thẻ Đơn hàng */}
        <div className="flex flex-col" style={{ gap: '16px' }}>
          {orders.map((order, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl flex flex-col md:flex-row md:items-center w-full hover:shadow-md transition-shadow" style={{ padding: '20px' }}>
              <div className="w-full md:w-[150px] font-bold text-gray-900 text-lg" style={{ marginBottom: '12px' }}>{order.id}</div>
              <div className="w-full md:w-[150px] text-gray-500 text-sm whitespace-pre-line" style={{ marginBottom: '12px' }}>{order.date}</div>
              
              <div className="w-full md:w-[200px]" style={{ marginBottom: '12px' }}>
                <span className="rounded-full font-bold text-xs inline-block" style={{ backgroundColor: order.statusBg, color: order.statusColor, padding: '6px 14px' }}>
                  {order.status}
                </span>
              </div>
              
              <div className="flex-1 font-bold text-gray-900 text-lg" style={{ marginBottom: '12px' }}>{order.total}</div>
              
              <button type="button" className="font-bold rounded-lg text-sm transition-colors" style={{ padding: '8px 20px', backgroundColor: order.btnBg || '#1A73E8', color: order.btnText || '#FFFFFF' }}>
                Chi tiết
              </button>
            </div>
          ))}
        </div>

        {/* Phân trang */}
        <div className="flex justify-center items-center w-full" style={{ gap: '10px', marginTop: '32px' }}>
          <button className="bg-white border border-gray-300 text-gray-600 rounded-full font-bold hover:bg-gray-50" style={{ width: '40px', height: '40px' }}>&lt;</button>
          <button className="bg-[#1A73E8] shadow-md shadow-blue-500/20 text-white rounded-full font-bold" style={{ width: '40px', height: '40px' }}>1</button>
          <button className="bg-white border border-gray-300 text-gray-600 rounded-full font-bold hover:bg-gray-50" style={{ width: '40px', height: '40px' }}>2</button>
          <button className="bg-white border border-gray-300 text-gray-600 rounded-full font-bold hover:bg-gray-50" style={{ width: '40px', height: '40px' }}>3</button>
          <button className="bg-white border border-gray-300 text-gray-600 rounded-full font-bold hover:bg-gray-50" style={{ width: '40px', height: '40px' }}>&gt;</button>
        </div>
      </div>
    );
  };

  // ==========================================
  // 4. GIAO DIỆN: THÔNG TIN CÁ NHÂN
  // ==========================================
  const renderProfile = () => (
    <div className="animate-in fade-in duration-300 w-full text-gray-900">
      <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>Hồ Sơ Của Tôi</h2>
      <p className="text-gray-500 text-sm" style={{ marginBottom: '24px' }}>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      
      <div className="flex flex-col lg:flex-row border-t border-gray-200 w-full" style={{ paddingTop: '32px' }}>
        
        {/* CỘT TRÁI: FORM ĐIỀN */}
        <div className="flex-1 lg:border-r border-gray-200" style={{ paddingBottom: '32px' }}>
          
          <div style={{ marginBottom: '24px', marginRight: '32px' }}>
            <label className="block text-sm font-bold text-gray-700" style={{ marginBottom: '8px' }}>Họ và tên</label>
            <input type="text" defaultValue="Nguyễn Văn Nam" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg outline-none focus:border-[#10B981] focus:bg-white transition-colors" style={{ padding: '12px 16px' }} />
          </div>

          <div className="flex flex-col sm:flex-row w-full" style={{ gap: '16px', marginBottom: '24px', paddingRight: '32px' }}>
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-700" style={{ marginBottom: '8px' }}>Email</label>
              <input type="email" defaultValue="abcdef@gmail.com" disabled className="w-full bg-gray-100 border border-gray-200 text-gray-500 rounded-lg outline-none cursor-not-allowed" style={{ padding: '12px 16px' }} />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-700" style={{ marginBottom: '8px' }}>Số điện thoại</label>
              <input type="tel" defaultValue="0123 456 789" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg outline-none focus:border-[#10B981] focus:bg-white transition-colors" style={{ padding: '12px 16px' }} />
            </div>
          </div>

          {/* Địa chỉ giao hàng */}
          <div style={{ marginBottom: '32px', marginRight: '32px' }}>
            <label className="block text-sm font-bold text-gray-700" style={{ marginBottom: '8px' }}>Địa chỉ giao hàng</label>
            
            <div className="bg-white border border-gray-200 text-gray-900 rounded-lg flex items-center shadow-sm" style={{ padding: '12px 16px', marginBottom: '12px' }}>
              <span style={{ marginRight: '8px' }}>📍</span> 43 Hà Nội
            </div>
            
            <div className="bg-green-50 border-2 border-[#10B981] text-gray-900 rounded-lg flex items-center shadow-sm" style={{ padding: '12px 16px', marginBottom: '12px' }}>
              <span style={{ marginRight: '8px' }}>📍</span> 48 HN
            </div>

            <button type="button" className="text-[#10B981] font-bold text-sm hover:underline" style={{ marginTop: '8px' }}>
              + Thêm địa chỉ mới
            </button>
          </div>

          {/* Đổi mật khẩu */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl" style={{ padding: '24px', marginRight: '32px', marginBottom: '32px' }}>
            <h3 className="text-gray-900 font-bold flex items-center" style={{ marginBottom: '20px' }}>
              <span style={{ marginRight: '8px' }}>🔒</span> Thay Đổi Mật Khẩu
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label className="block text-sm text-gray-600" style={{ marginBottom: '8px' }}>Mật khẩu hiện tại</label>
              <input type="password" defaultValue="12345678" className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg outline-none focus:border-[#10B981]" style={{ padding: '12px 16px' }} />
            </div>
            
            <div className="flex flex-col sm:flex-row w-full" style={{ gap: '16px' }}>
              <div className="flex-1">
                <label className="block text-sm text-gray-600" style={{ marginBottom: '8px' }}>Mật khẩu mới</label>
                <input type="password" placeholder="Nhập mật khẩu mới" className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg outline-none focus:border-[#10B981]" style={{ padding: '12px 16px' }} />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600" style={{ marginBottom: '8px' }}>Xác nhận mật khẩu mới</label>
                <input type="password" placeholder="Xác nhận lại" className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg outline-none focus:border-[#10B981]" style={{ padding: '12px 16px' }} />
              </div>
            </div>
          </div>

          <div className="flex items-center" style={{ gap: '16px' }}>
            <button type="button" className="bg-[#1A73E8] hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all" style={{ padding: '12px 32px' }}>
              LƯU THAY ĐỔI
            </button>
            <button type="button" className="text-gray-500 font-bold hover:text-gray-900" style={{ padding: '12px 24px' }}>
              Hủy
            </button>
          </div>
        </div>
        
        {/* CỘT PHẢI: AVATAR */}
        <div className="w-full lg:w-1/3 flex flex-col items-center" style={{ paddingTop: '16px', paddingLeft: '16px' }}>
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl font-bold text-gray-400 shadow-inner" style={{ marginBottom: '24px' }}>
            👤
          </div>
          <button type="button" className="border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm" style={{ padding: '8px 24px', marginBottom: '16px' }}>
            Chọn Ảnh
          </button>
          <p className="text-xs text-gray-500 text-center uppercase tracking-wider">
            Dung lượng file tối đa 1 MB<br/>Định dạng: .JPEG, .PNG
          </p>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // 5. GIAO DIỆN: THÔNG BÁO
  // ==========================================
  const renderNotifications = () => {
    const notis = [
      { id: 1, icon: "📦", title: "Đơn hàng 1 đang được giao!", desc: "Đơn hàng của bạn đã được bàn giao cho đơn vị vận chuyển.\nVui lòng chú ý điện thoại để nhận hàng.", time: "2 giờ trước", unread: true },
      { id: 2, icon: "🎉", title: "Khuyến mãi cuối tuần: Giảm ngay 20% Laptop Gaming", desc: "Nhập mã GAMING20 để được giảm giá lên đến 2 triệu đồng.\nClick để xem chi tiết sản phẩm áp dụng!", time: "Hôm qua, 15:30", unread: true },
      { id: 3, icon: "✅", title: "Giao hàng thành công", desc: "Đơn hàng 1 đã được giao thành công.\nĐừng quên đánh giá sản phẩm để nhận xu nhé!", time: "03/05/2026", unread: false },
      { id: 4, icon: "⚙️", title: "Cập nhật chính sách bảo mật", desc: "Chúng tôi đã cập nhật lại điều khoản dịch vụ và chính sách bảo mật. Áp dụng từ 01/05/2026.", time: "28/04/2026", unread: false },
    ];

    return (
      <div className="animate-in fade-in duration-300 w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full" style={{ marginBottom: '24px' }}>
          <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '12px' }}>Thông báo của bạn</h2>
          <button type="button" className="text-[#1A73E8] font-bold text-sm hover:underline">✔️ Đánh dấu tất cả đã đọc</button>
        </div>
        
        <div className="flex border-b border-gray-200 w-full flex-wrap" style={{ gap: '24px', marginBottom: '24px' }}>
          <button type="button" className="text-[#1A73E8] font-bold border-b-2 border-[#1A73E8]" style={{ paddingBottom: '12px' }}>Tất cả (2)</button>
          <button type="button" className="text-gray-500 hover:text-gray-900" style={{ paddingBottom: '12px' }}>Đơn hàng</button>
          <button type="button" className="text-gray-500 hover:text-gray-900" style={{ paddingBottom: '12px' }}>Khuyến mãi</button>
          <button type="button" className="text-gray-500 hover:text-gray-900" style={{ paddingBottom: '12px' }}>Hệ thống</button>
        </div>

        <div className="flex flex-col w-full" style={{ gap: '16px' }}>
          {notis.map((noti) => (
            <div key={noti.id} className={`rounded-xl border ${noti.unread ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'} flex items-start w-full hover:shadow-sm transition-shadow`} style={{ padding: '20px' }}>
              <div className="flex-shrink-0 text-3xl" style={{ marginRight: '16px' }}>{noti.icon}</div>
              <div className="flex-1">
                <h4 className={`text-lg font-bold ${noti.unread ? 'text-gray-900' : 'text-gray-600'}`} style={{ marginBottom: '4px' }}>
                  {noti.unread && <span className="inline-block w-2 h-2 bg-[#1A73E8] rounded-full align-middle" style={{ marginRight: '8px' }}></span>}
                  {noti.title}
                </h4>
                <p className="text-gray-600 text-sm whitespace-pre-line" style={{ marginBottom: '8px' }}>{noti.desc}</p>
                {noti.unread && <button type="button" className="text-[#1A73E8] text-sm font-bold hover:underline">Xem chi tiết</button>}
              </div>
              <span className="text-sm text-[#1A73E8] font-bold whitespace-nowrap hidden sm:block" style={{ marginLeft: '16px' }}>{noti.time}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==========================================
  // 6. MODAL ĐĂNG XUẤT (BẬT LÊN KHI NHẤN ĐĂNG XUẤT)
  // ==========================================
  const renderLogoutModal = () => {
    if (!isLogoutModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200" style={{ padding: '32px', margin: '16px', width: '100%', maxWidth: '400px' }}>
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-4xl" style={{ marginBottom: '20px' }}>
            🚪
          </div>
          <h3 className="text-xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>Xác nhận đăng xuất</h3>
          <p className="text-gray-500" style={{ marginBottom: '24px' }}>Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình không?</p>
          
          <div className="flex w-full" style={{ gap: '16px' }}>
            <button 
              type="button"
              onClick={() => setIsLogoutModalOpen(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors" 
              style={{ padding: '12px' }}
            >
              Hủy bỏ
            </button>
            <button 
              type="button"
              onClick={() => {
                alert("Đăng xuất thành công!");
                setIsLogoutModalOpen(false);
              }}
              className="flex-1 bg-[#EF4444] hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/30" 
              style={{ padding: '12px' }}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // 7. GIAO DIỆN: FOOTER
  // ==========================================
  const renderFooter = () => {
    return (
      <div className="w-full bg-[#F3F4F6] border-t border-gray-200" style={{ padding: '40px 16px', marginTop: 'auto' }}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between" style={{ gap: '24px' }}>
          
          {/* Cột trái: Text */}
          <div className="flex-1 text-center lg:text-left w-full">
            <h2 className="text-2xl font-bold text-[#111827]" style={{ marginBottom: '8px' }}>Subscribe our Newsletter</h2>
            <p className="text-sm text-[#6B7280] mx-auto lg:mx-0" style={{ maxWidth: '400px' }}>
              Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna.
            </p>
          </div>

          {/* Cột giữa: Khung Input Email */}
          <div className="flex-1 flex justify-center w-full">
            <div className="flex items-center bg-white rounded-full w-full max-w-md shadow-sm border border-gray-200" style={{ padding: '6px' }}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 outline-none text-gray-700 bg-transparent text-sm w-full" 
                style={{ padding: '10px 16px' }} 
              />
              <button 
                type="button" 
                className="bg-[#00B207] hover:bg-green-600 text-white font-bold rounded-full text-sm transition-colors whitespace-nowrap" 
                style={{ padding: '12px 28px' }}
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Cột phải: Icon Mạng Xã Hội */}
          <div className="flex-1 flex justify-center lg:justify-end items-center w-full" style={{ gap: '16px' }}>
            {/* Facebook */}
            <div className="bg-[#00B207] text-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity shadow-sm" style={{ width: '40px', height: '40px' }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </div>
            {/* Twitter */}
            <div className="text-gray-500 hover:text-[#00B207] cursor-pointer transition-colors flex items-center justify-center" style={{ width: '40px', height: '40px' }}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </div>
            {/* Pinterest */}
            <div className="text-gray-500 hover:text-[#00B207] cursor-pointer transition-colors flex items-center justify-center" style={{ width: '40px', height: '40px' }}>
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 4.3 2.6 8 6.4 9.5-.1-.8-.2-2.1 0-3l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.8 0 1.2.6 1.2 1.4 0 .8-.5 2.1-.8 3.2-.2 1 .5 1.8 1.4 1.8 1.7 0 3.1-1.8 3.1-4.4 0-2.3-1.6-3.8-3.9-3.8-2.6 0-4.2 2-4.2 4 0 .8.3 1.7.7 2.2.1.1.1.2.1.3-.1.4-.3 1.2-.3 1.4-.1.2-.2.3-.5.1-1.6-.7-2.6-2.9-2.6-4.7 0-3.8 2.8-7.3 8-7.3 4.2 0 7.5 3 7.5 7 0 4.2-2.6 7.6-6.3 7.6-1.2 0-2.4-.6-2.8-1.4l-.8 3c-.3 1.1-1.1 2.4-1.6 3.2 1.3.4 2.7.6 4.1.6 5.5 0 10-4.5 10-10S17.5 2 12 2z"></path>
              </svg>
            </div>
            {/* Instagram */}
            <div className="text-gray-500 hover:text-[#00B207] cursor-pointer transition-colors flex items-center justify-center" style={{ width: '40px', height: '40px' }}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // HÀM CHÍNH: RENDER TOÀN BỘ TRANG
  // ==========================================
  
  let rightContent = null;
  switch (activeTab) {
    case "dashboard": rightContent = renderDashboard(); break;
    case "orders": rightContent = renderOrders(); break;
    case "profile": rightContent = renderProfile(); break;
    case "notifications": rightContent = renderNotifications(); break;
    default: rightContent = renderDashboard();
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col justify-between">
      
      {/* Pop-up Đăng xuất */}
      {renderLogoutModal()}

      {/* Khung Giao Diện Chính (Sidebar + Nội dung phải) */}
      <div className="w-full flex-grow" style={{ padding: '40px 16px' }}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row w-full" style={{ gap: '32px' }}>
          
          {/* Render Thanh Menu Trái */}
          {renderSidebar()}

          {/* Khung Nội Dung Phải */}
          <div className="flex-1 w-full min-w-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm w-full" style={{ padding: '32px', minHeight: '650px' }}>
               {rightContent}
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      {renderFooter()}

    </div>
  );
}