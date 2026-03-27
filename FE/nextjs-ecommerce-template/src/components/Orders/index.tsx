import React, { useEffect, useState } from "react";
import SingleOrder from "./SingleOrder";

const Orders = () => {
  const [orders, setOrders] = useState<any>([]);

  useEffect(() => {
    fetch(`/api/order`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[770px]">

          {/* tiêu đề bảng */}
          {orders.length > 0 && (
            <div className="items-center justify-between py-4.5 px-7.5 hidden md:flex">
              <div className="min-w-[111px]">
                <p className="text-custom-sm text-dark">Mã đơn</p>
              </div>

              <div className="min-w-[175px]">
                <p className="text-custom-sm text-dark">Ngày đặt</p>
              </div>

              <div className="min-w-[128px]">
                <p className="text-custom-sm text-dark">Trạng thái</p>
              </div>

              <div className="min-w-[213px]">
                <p className="text-custom-sm text-dark">Sản phẩm</p>
              </div>

              <div className="min-w-[113px]">
                <p className="text-custom-sm text-dark">Tổng tiền</p>
              </div>

              <div className="min-w-[113px]">
                <p className="text-custom-sm text-dark">Thao tác</p>
              </div>
            </div>
          )}

          {orders.length > 0 ? (
            orders.map((orderItem: any, key: number) => (
              <SingleOrder key={key} orderItem={orderItem} smallView={false} />
            ))
          ) : (
            <p className="py-9.5 px-4 sm:px-7.5 xl:px-10">
              Bạn chưa có đơn hàng nào!
            </p>
          )}
        </div>

        {orders.length > 0 &&
          orders.map((orderItem: any, key: number) => (
            <SingleOrder key={key} orderItem={orderItem} smallView={true} />
          ))}
      </div>
    </>
  );
};

export default Orders;