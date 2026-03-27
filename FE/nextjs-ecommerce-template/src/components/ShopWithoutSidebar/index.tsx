"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";

import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import CustomSelect from "../ShopWithSidebar/CustomSelect";

import shopData from "../Shop/shopData";

const ShopWithoutSidebar = () => {
  const [productStyle, setProductStyle] = useState("grid");

  const options = [
    { label: "Sản phẩm mới nhất", value: "0" },
    { label: "Bán chạy nhất", value: "1" },
    { label: "Sản phẩm cũ", value: "2" },
  ];

  return (
    <>
      <Breadcrumb
        title={"Tất cả sản phẩm"}
        pages={["Cửa hàng", "/", "Danh sách sản phẩm"]}
      />

      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">

            <div className="w-full">

              {/* TOP BAR */}
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">

                  {/* BÊN TRÁI */}
                  <div className="flex flex-wrap items-center gap-4">
                    <CustomSelect options={options} />

                    <p>
                      Hiển thị <span className="text-dark">9 / 50</span> sản phẩm
                    </p>
                  </div>

                  {/* BÊN PHẢI */}
                  <div className="flex items-center gap-2.5">

                    {/* GRID */}
                    <button
                      onClick={() => setProductStyle("grid")}
                      aria-label="Hiển thị dạng lưới"
                      className={`${
                        productStyle === "grid"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      Grid
                    </button>

                    {/* LIST */}
                    <button
                      onClick={() => setProductStyle("list")}
                      aria-label="Hiển thị dạng danh sách"
                      className={`${
                        productStyle === "list"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      List
                    </button>

                  </div>
                </div>
              </div>

              {/* DANH SÁCH SẢN PHẨM */}
              <div
                className={`${
                  productStyle === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7.5 gap-y-9"
                    : "flex flex-col gap-7.5"
                }`}
              >
                {shopData.map((item, key) =>
                  productStyle === "grid" ? (
                    <SingleGridItem item={item} key={key} />
                  ) : (
                    <SingleListItem item={item} key={key} />
                  )
                )}
              </div>

              {/* PHÂN TRANG */}
              <div className="flex justify-center mt-15">
                <div className="bg-white shadow-1 rounded-md p-2">
                  <ul className="flex items-center">

                    <li>
                      <button
                        aria-label="Trang trước"
                        type="button"
                        disabled
                        className="flex items-center justify-center w-8 h-9 duration-200 rounded-[3px] disabled:text-gray-4"
                      >
                        ◀
                      </button>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 rounded-[3px] bg-blue text-white"
                      >
                        1
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 rounded-[3px] hover:bg-blue hover:text-white"
                      >
                        2
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 rounded-[3px] hover:bg-blue hover:text-white"
                      >
                        3
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 rounded-[3px] hover:bg-blue hover:text-white"
                      >
                        ...
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 rounded-[3px] hover:bg-blue hover:text-white"
                      >
                        10
                      </a>
                    </li>

                    <li>
                      <button
                        aria-label="Trang sau"
                        type="button"
                        className="flex items-center justify-center w-8 h-9 duration-200 rounded-[3px] hover:bg-blue hover:text-white"
                      >
                        ▶
                      </button>
                    </li>

                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithoutSidebar;