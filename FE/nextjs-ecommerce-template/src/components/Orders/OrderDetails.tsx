import React from "react";

const OrderDetails = ({ orderItem }: any) => {
  return (
    <>
      <div className="items-center justify-between py-4.5 px-7.5 hidden md:flex">
        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Mã đơn</p>
        </div>

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Ngày đặt</p>
        </div>

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Trạng thái</p>
        </div>

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Tổng tiền</p>
        </div>
      </div>

      <div className="items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex">
        
        <div className="min-w-[111px]">
          <p className="text-custom-sm text-red">
            #{orderItem.orderId.slice(-8)}
          </p>
        </div>

        <div className="min-w-[175px]">
          <p className="text-custom-sm text-dark">
            {orderItem.createdAt}
          </p>
        </div>

        <div className="min-w-[128px]">
          <p
            className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] capitalize ${
              orderItem.status === "delivered"
                ? "text-green bg-green-light-6"
                : orderItem.status === "on-hold"
                ? "text-red bg-red-light-6"
                : orderItem.status === "processing"
                ? "text-yellow bg-yellow-light-4"
                : ""
            }`}
          >
            {orderItem.status === "delivered"
              ? "Đã giao"
              : orderItem.status === "processing"
              ? "Đang xử lý"
              : orderItem.status === "on-hold"
              ? "Tạm giữ"
              : "Không xác định"}
          </p>
        </div>

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">
            {orderItem.total}
          </p>
        </div>
      </div>

      <div className="px-7.5 w-full">
        <p className="font-bold">Địa chỉ giao hàng:</p>
        <p>942 Aspen Road Encino, CA 91316</p>
      </div>
    </>
  );
};

export default OrderDetails;