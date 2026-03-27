import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import SearchForm from "../Blog/SearchForm";
import LatestPosts from "../Blog/LatestPosts";
import LatestProducts from "../Blog/LatestProducts";
import blogData from "../BlogGrid/blogData";
import Image from "next/image";
import shopData from "../Shop/shopData";

const BlogDetailsWithSidebar = () => {
  return (
    <>
      <Breadcrumb
        title={"Chi tiết Blog"}
        pages={["chi tiết blog"]}
      />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-12.5">

            {/* Nội dung blog */}
            <div className="lg:max-w-[750px] w-full">
              <div className="rounded-[10px] overflow-hidden mb-7.5">
                <Image
                  className="rounded-[10px]"
                  src="/images/blog/blog-details-01.jpg"
                  alt="chi tiết"
                  width={750}
                  height={477}
                />
              </div>

              <div>
                <span className="flex items-center gap-3 mb-4">
                  <a href="#" className="ease-out duration-200 hover:text-blue">
                    27 Tháng 3, 2022
                  </a>

                  <span className="block w-px h-4 bg-gray-4"></span>

                  <a href="#" className="ease-out duration-200 hover:text-blue">
                    300k lượt xem
                  </a>
                </span>

                <h2 className="font-medium text-dark text-xl lg:text-2xl xl:text-custom-4xl mb-4">
                  Cần những thông tin gì để vận chuyển hàng?
                </h2>

                <p className="mb-6">
                  Đây là bài viết mô tả các thông tin cần thiết khi vận chuyển
                  hàng hóa. Người gửi cần cung cấp đầy đủ địa chỉ, số điện thoại
                  và thông tin sản phẩm để đảm bảo giao hàng chính xác.
                </p>

                <p className="mb-6">
                  Khi đặt hàng trực tuyến, người dùng nên kiểm tra kỹ thông tin
                  trước khi xác nhận để tránh sai sót trong quá trình giao hàng.
                </p>

                <p>
                  Ngoài ra, việc đóng gói sản phẩm đúng cách cũng rất quan trọng
                  để tránh hư hỏng trong quá trình vận chuyển.
                </p>

                <div className="mt-7.5">
                  <h3 className="font-medium text-dark text-lg xl:text-[26px] xl:leading-[34px] mb-6">
                    Chợ trực tuyến dành cho nhà thiết kế UI/UX
                  </h3>

                  <ul className="list-disc pl-6">
                    <li>Giao diện hiện đại và dễ sử dụng</li>
                    <li>Tối ưu cho trải nghiệm người dùng</li>
                    <li>Hỗ trợ nhiều nền tảng thiết kế</li>
                    <li>Kho tài nguyên phong phú</li>
                  </ul>
                </div>

                <div className="rounded-xl bg-white pt-7.5 pb-6 px-4 sm:px-7.5 my-7.5">
                  <p className="italic text-dark text-center">
                    “Thiết kế tốt không chỉ đẹp mà còn phải mang lại trải nghiệm
                    tốt cho người dùng.”
                  </p>

                  <a
                    href="#"
                    className="flex items-center justify-center gap-3 mt-5.5"
                  >
                    <div className="flex w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src="/images/users/user-04.jpg"
                        alt="user"
                        width={48}
                        height={48}
                      />
                    </div>

                    <div>
                      <h4 className="text-dark text-custom-sm">
                        Jhon Drineo
                      </h4>
                      <p className="text-custom-xs">
                        Doanh nhân
                      </p>
                    </div>
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-10 mt-10">
                  <div className="flex flex-wrap items-center gap-5">
                    <p>Thẻ phổ biến :</p>

                    <ul className="flex flex-wrap items-center gap-3.5">
                      <li>
                        <a className="inline-flex hover:text-white border border-gray-3 bg-white py-2 px-4 rounded-md ease-out duration-200 hover:bg-blue hover:border-blue">
                          Máy tính bàn
                        </a>
                      </li>

                      <li>
                        <a className="inline-flex hover:text-white border border-gray-3 bg-white py-2 px-4 rounded-md ease-out duration-200 hover:bg-blue hover:border-blue">
                          Macbook
                        </a>
                      </li>

                      <li>
                        <a className="inline-flex hover:text-white border border-gray-3 bg-white py-2 px-4 rounded-md ease-out duration-200 hover:bg-blue hover:border-blue">
                          PC
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:max-w-[370px] w-full">

              {/* Tìm kiếm */}
              <SearchForm />

              {/* Bài viết mới */}
              <LatestPosts blogs={blogData} />

              {/* Sản phẩm mới */}
              <LatestProducts products={shopData} />

              {/* Danh mục phổ biến */}
              <div className="shadow-1 bg-white rounded-xl mt-7.5">
                <div className="px-4 sm:px-6 py-4.5 border-b border-gray-3">
                  <h2 className="font-medium text-lg text-dark">
                    Danh mục phổ biến
                  </h2>
                </div>

                <div className="p-4 sm:p-6 flex flex-col gap-3">
                  <button className="flex justify-between hover:text-blue">
                    Máy tính bàn <span>12</span>
                  </button>

                  <button className="flex justify-between hover:text-blue">
                    Laptop <span>25</span>
                  </button>

                  <button className="flex justify-between hover:text-blue">
                    Màn hình <span>23</span>
                  </button>

                  <button className="flex justify-between hover:text-blue">
                    Điện thoại <span>54</span>
                  </button>

                  <button className="flex justify-between hover:text-blue">
                    Máy tính bảng <span>21</span>
                  </button>

                  <button className="flex justify-between hover:text-blue">
                    Đồng hồ <span>17</span>
                  </button>

                  <button className="flex justify-between hover:text-blue">
                    Chuột <span>08</span>
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="shadow-1 bg-white rounded-xl mt-7.5">
                <div className="px-4 sm:px-6 py-4.5 border-b border-gray-3">
                  <h2 className="font-medium text-lg text-dark">
                    Thẻ
                  </h2>
                </div>

                <div className="p-4 sm:p-6 flex flex-wrap gap-3.5">
                  <a className="border py-2 px-4 rounded-md">Máy tính bàn</a>
                  <a className="border py-2 px-4 rounded-md">Macbook</a>
                  <a className="border py-2 px-4 rounded-md">PC</a>
                  <a className="border py-2 px-4 rounded-md">Đồng hồ</a>
                  <a className="border py-2 px-4 rounded-md">Cáp USB</a>
                  <a className="border py-2 px-4 rounded-md">Chuột</a>
                  <a className="border py-2 px-4 rounded-md">Windows PC</a>
                  <a className="border py-2 px-4 rounded-md">Màn hình</a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetailsWithSidebar;