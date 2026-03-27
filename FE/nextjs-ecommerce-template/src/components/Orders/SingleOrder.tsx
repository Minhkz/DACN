import React, { useState } from "react";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";

const SingleOrder = ({ orderItem, smallView }: any) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  const toggleModal = (status: boolean) => {
    setShowDetails(status);
    setShowEdit(status);
  };

  return (
    <>
      {!smallView && (
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

          <div className="min-w-[213px]">
            <p className="text-custom-sm text-dark">
              {orderItem.title}
            </p>
          </div>

          <div className="min-w-[113px]">
            <p className="text-custom-sm text-dark">
              {orderItem.total}
            </p>
          </div>

          <div className="flex gap-5 items-center">
            <OrderActions
              toggleDetails={toggleDetails}
              toggleEdit={toggleEdit}
            />
          </div>

        </div>
      )}

      {smallView && (
        <div className="block md:hidden">
          <div className="py-4.5 px-7.5">

            <p className="text-custom-sm text-dark">
              <span className="font-bold pr-2">Mã đơn:</span>
              #{orderItem.orderId.slice(-8)}
            </p>

            <p className="text-custom-sm text-dark">
              <span className="font-bold pr-2">Ngày đặt:</span>
              {orderItem.createdAt}
            </p>

            <p className="text-custom-sm text-dark">
              <span className="font-bold pr-2">Trạng thái:</span>
              <span
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
              </span>
            </p>

            <p className="text-custom-sm text-dark">
              <span className="font-bold pr-2">Sản phẩm:</span>
              {orderItem.title}
            </p>

            <p className="text-custom-sm text-dark">
              <span className="font-bold pr-2">Tổng tiền:</span>
              {orderItem.total}
            </p>

            <p className="text-custom-sm text-dark flex items-center">
              <span className="font-bold pr-2">Thao tác:</span>
              <OrderActions
                toggleDetails={toggleDetails}
                toggleEdit={toggleEdit}
              />
            </p>

          </div>
        </div>
      )}

      <OrderModal
        showDetails={showDetails}
        showEdit={showEdit}
        toggleModal={toggleModal}
        order={orderItem}
      />
    </>
  );
};

export default SingleOrder;