import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import blogData from "./blogData";
import BlogItem from "../Blog/BlogItem";

const BlogGrid = () => {
  return (
    <>
      <Breadcrumb title={"Danh sách Blog"} pages={["blog"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-7.5">

            {/* danh sách bài viết */}
            {blogData.map((blog, key) => (
              <BlogItem blog={blog} key={key} />
            ))}

          </div>

          {/* Phân trang blog */}
          <div className="flex justify-center mt-15">
            <div className="bg-white shadow-1 rounded-md p-2">
              <ul className="flex items-center">

                <li>
                  <button
                    aria-label="nút trang trước"
                    type="button"
                    disabled
                    className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] disabled:text-gray-4"
                  >
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                    >
                      <path d="M12.1782 16.1156L5.37197 9.45L12.6282 2.08125" />
                    </svg>
                  </button>
                </li>

                <li>
                  <a className="flex py-1.5 px-3.5 bg-blue text-white rounded-[3px]">
                    1
                  </a>
                </li>

                <li>
                  <a className="flex py-1.5 px-3.5 hover:text-white hover:bg-blue rounded-[3px]">
                    2
                  </a>
                </li>

                <li>
                  <a className="flex py-1.5 px-3.5 hover:text-white hover:bg-blue rounded-[3px]">
                    3
                  </a>
                </li>

                <li>
                  <a className="flex py-1.5 px-3.5 hover:text-white hover:bg-blue rounded-[3px]">
                    4
                  </a>
                </li>

                <li>
                  <a className="flex py-1.5 px-3.5 hover:text-white hover:bg-blue rounded-[3px]">
                    5
                  </a>
                </li>

                <li>
                  <a className="flex py-1.5 px-3.5">...</a>
                </li>

                <li>
                  <a className="flex py-1.5 px-3.5 hover:text-white hover:bg-blue rounded-[3px]">
                    10
                  </a>
                </li>

                <li>
                  <button
                    aria-label="nút trang sau"
                    type="button"
                    className="flex items-center justify-center w-8 h-9 hover:text-white hover:bg-blue rounded-[3px]"
                  >
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                    >
                      <path d="M5.82197 16.1156L12.6282 9L5.37197 2.08125" />
                    </svg>
                  </button>
                </li>

              </ul>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default BlogGrid;