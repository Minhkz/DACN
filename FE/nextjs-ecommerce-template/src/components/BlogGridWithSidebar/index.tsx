import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import BlogItem from "../Blog/BlogItem";
import blogData from "../BlogGrid/blogData";
import SearchForm from "../Blog/SearchForm";
import LatestPosts from "../Blog/LatestPosts";
import LatestProducts from "../Blog/LatestProducts";
import Categories from "../Blog/Categories";
import shopData from "../Shop/shopData";

const BlogGridWithSidebar = () => {
  const categories = [
    {
      name: "Máy tính bàn",
      products: 10,
    },
    {
      name: "Laptop",
      products: 12,
    },
    {
      name: "Màn hình",
      products: 30,
    },
    {
      name: "UPS",
      products: 23,
    },
    {
      name: "Điện thoại",
      products: 10,
    },
    {
      name: "Đồng hồ",
      products: 13,
    },
  ];

  return (
    <>
      <Breadcrumb title={"Danh sách Blog"} pages={["blog"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row gap-7.5">

            {/* danh sách blog */}
            <div className="lg:max-w-[770px] w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-7.5">
                {blogData.map((blog, key) => (
                  <BlogItem blog={blog} key={key} />
                ))}
              </div>

              {/* phân trang */}
              <div className="flex justify-center mt-15">
                <div className="bg-white shadow-1 rounded-md p-2">
                  <ul className="flex items-center">

                    <li>
                      <button
                        aria-label="trang trước"
                        type="button"
                        disabled
                        className="flex items-center justify-center w-8 h-9"
                      >
                        ◀
                      </button>
                    </li>

                    <li>
                      <a className="flex py-1.5 px-3.5 bg-blue text-white rounded-[3px]">
                        1
                      </a>
                    </li>

                    <li>
                      <a className="flex py-1.5 px-3.5 hover:bg-blue hover:text-white">
                        2
                      </a>
                    </li>

                    <li>
                      <a className="flex py-1.5 px-3.5 hover:bg-blue hover:text-white">
                        3
                      </a>
                    </li>

                    <li>
                      <a className="flex py-1.5 px-3.5 hover:bg-blue hover:text-white">
                        4
                      </a>
                    </li>

                    <li>
                      <a className="flex py-1.5 px-3.5 hover:bg-blue hover:text-white">
                        5
                      </a>
                    </li>

                    <li>
                      <a className="flex py-1.5 px-3.5">...</a>
                    </li>

                    <li>
                      <a className="flex py-1.5 px-3.5 hover:bg-blue hover:text-white">
                        10
                      </a>
                    </li>

                    <li>
                      <button
                        aria-label="trang sau"
                        type="button"
                        className="flex items-center justify-center w-8 h-9"
                      >
                        ▶
                      </button>
                    </li>

                  </ul>
                </div>
              </div>
            </div>

            {/* sidebar blog */}
            <div className="lg:max-w-[370px] w-full">

              {/* ô tìm kiếm */}
              <SearchForm />

              {/* bài viết mới */}
              <LatestPosts blogs={blogData} />

              {/* sản phẩm mới */}
              <LatestProducts products={shopData} />

              {/* danh mục phổ biến */}
              <Categories categories={categories} />

              {/* thẻ */}
              <div className="shadow-1 bg-white rounded-xl mt-7.5">
                <div className="px-4 sm:px-6 py-4.5 border-b border-gray-3">
                  <h2 className="font-medium text-lg text-dark">
                    Thẻ
                  </h2>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex flex-wrap gap-3.5">

                    <a className="border py-2 px-4 rounded-md">
                      Máy tính bàn
                    </a>

                    <a className="border py-2 px-4 rounded-md">
                      Macbook
                    </a>

                    <a className="border py-2 px-4 rounded-md">
                      PC
                    </a>

                    <a className="border py-2 px-4 rounded-md">
                      Đồng hồ
                    </a>

                    <a className="border py-2 px-4 rounded-md">
                      Cáp USB
                    </a>

                    <a className="border py-2 px-4 rounded-md">
                      Chuột
                    </a>

                    <a className="border py-2 px-4 rounded-md">
                      Máy tính Windows
                    </a>

                    <a className="border py-2 px-4 rounded-md">
                      Màn hình
                    </a>

                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default BlogGridWithSidebar;