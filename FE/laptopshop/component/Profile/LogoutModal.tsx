import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function LogoutModal({ open, onClose }: Props) {
  if (!open) return null;

  const handleLogout = () => {
    alert("Đăng xuất thành công!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
        style={{
          padding: "32px",
          margin: "16px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div
          className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-4xl"
          style={{ marginBottom: "20px" }}
        >
          🚪
        </div>

        <h3
          className="text-xl font-bold text-gray-900"
          style={{ marginBottom: "8px" }}
        >
          Xác nhận đăng xuất
        </h3>

        <p className="text-gray-500" style={{ marginBottom: "24px" }}>
          Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình không?
        </p>

        <div className="flex w-full" style={{ gap: "16px" }}>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
            style={{ padding: "12px" }}
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/30"
            style={{ padding: "12px" }}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
