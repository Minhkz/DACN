"use client";
import React from "react";
import Discount from "./Discount";
import OrderSummary from "./OrderSummary";
import { useAppSelector } from "@/redux/store";
import SingleItem from "./SingleItem";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);

  return (
    <>
      {/* Breadcrumb */}
      <section>
        <Breadcrumb title={"Giỏ hàng"} pages={["Giỏ hàng"]} />
      </section>

      {cartItems.length > 0 ? (
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            
            <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
              <h2 className="font-medium text-dark text-2xl">
                Giỏ hàng của bạn
              </h2>

              <button className="text-blue">
                Xóa toàn bộ giỏ hàng
              </button>
            </div>

            <div className="bg-white rounded-[10px] shadow-1">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[1170px]">

                  {/* Table Header */}
                  <div className="flex items-center py-5.5 px-7.5">
                    
                    <div className="min-w-[400px]">
                      <p className="text-dark">Sản phẩm</p>
                    </div>

                    <div className="min-w-[180px]">
                      <p className="text-dark">Giá</p>
                    </div>

                    <div className="min-w-[275px]">
                      <p className="text-dark">Số lượng</p>
                    </div>

                    <div className="min-w-[200px]">
                      <p className="text-dark">Tạm tính</p>
                    </div>

                    <div className="min-w-[50px]">
                      <p className="text-dark text-right">Thao tác</p>
                    </div>

                  </div>

                  {/* Cart Item */}
                  {cartItems.length > 0 &&
                    cartItems.map((item, key) => (
                      <SingleItem item={item} key={key} />
                    ))}

                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11 mt-9">
              <Discount />
              <OrderSummary />
            </div>

          </div>
        </section>
      ) : (
        <div className="text-center mt-8">

          <div className="mx-auto pb-7.5">
            {/* icon giữ nguyên */}
            <svg
              className="mx-auto"
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
            >
              <circle cx="50" cy="50" r="50" fill="#F3F4F6" />
            </svg>
          </div>

          <p className="pb-6">Giỏ hàng của bạn đang trống!</p>

          <Link
            href="/shop-with-sidebar"
            className="w-96 mx-auto flex justify-center font-medium text-white bg-dark py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-opacity-95"
          >
            Tiếp tục mua sắm
          </Link>

        </div>
      )}
    </>
  );
};

export default Cart;