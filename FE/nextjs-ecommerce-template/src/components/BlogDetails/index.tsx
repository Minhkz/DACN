import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import Link from "next/link";

const BlogDetails = () => {
  return (
    <>
      <Breadcrumb title={"Chi tiết Blog"} pages={["Chi tiết blog"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[750px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          
          <div className="rounded-[10px] overflow-hidden mb-7.5">
            <Image
              className="rounded-[10px]"
              src="/images/blog/blog-details-01.jpg"
              alt="chi-tiet"
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
                300K lượt xem
              </a>
            </span>

            <h2 className="font-medium text-dark text-xl lg:text-2xl xl:text-custom-4xl mb-4">
              Cần những thông tin gì để giao hàng?
            </h2>

            <p className="mb-6">
              Khi đặt hàng trực tuyến, bạn cần cung cấp đầy đủ thông tin để việc
              giao hàng diễn ra nhanh chóng và chính xác. Các thông tin cơ bản
              thường bao gồm tên người nhận, số điện thoại, địa chỉ giao hàng
              và ghi chú nếu cần thiết.
            </p>

            <p className="mb-6">
              Việc cung cấp thông tin chính xác giúp đơn vị vận chuyển dễ dàng
              liên hệ và đảm bảo hàng hóa được giao đúng địa chỉ, đúng thời
              gian mong muốn.
            </p>

            <p>
              Ngoài ra, bạn cũng có thể cung cấp thêm các thông tin như thời gian
              nhận hàng phù hợp hoặc hướng dẫn chi tiết vị trí giao hàng để quá
              trình giao nhận thuận tiện hơn.
            </p>

            <div className="mt-7.5">
              <h3 className="font-medium text-dark text-lg xl:text-[26px] xl:leading-[34px] mb-6">
                Chợ kỹ thuật số dành cho nhà thiết kế UI/UX
              </h3>

              <ul className="list-disc pl-6">
                <li>Thiết kế giao diện hiện đại và thân thiện với người dùng.</li>
                <li>Kho tài nguyên thiết kế phong phú.</li>
                <li>Nhiều công cụ hỗ trợ cho nhà phát triển.</li>
                <li>Dễ dàng mua và bán sản phẩm kỹ thuật số.</li>
              </ul>
            </div>

            <div className="rounded-xl bg-white pt-7.5 pb-6 px-4 sm:px-7.5 my-7.5">
              <p className="italic text-dark text-center">
                “Thiết kế tốt không chỉ đẹp mắt mà còn phải mang lại trải nghiệm
                tuyệt vời cho người dùng.”
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
                  <h4 className="text-dark text-custom-sm">John Drineo</h4>
                  <p className="text-custom-xs">Doanh nhân</p>
                </div>
              </a>
            </div>

            <p className="mb-6">
              Việc phát triển nền tảng thương mại điện tử ngày nay không chỉ
              dừng lại ở việc bán sản phẩm mà còn phải tạo ra trải nghiệm mua
              sắm thuận tiện và an toàn cho người dùng.
            </p>

            <p className="mb-6">
              Các doanh nghiệp cần đầu tư vào giao diện, tốc độ tải trang và hệ
              thống thanh toán để nâng cao sự hài lòng của khách hàng.
            </p>

            <p className="mb-6">
              Ngoài ra, việc tối ưu trải nghiệm trên thiết bị di động cũng rất
              quan trọng vì phần lớn người dùng hiện nay mua sắm qua điện thoại.
            </p>

            <p>
              Một hệ thống website tốt sẽ giúp doanh nghiệp tăng doanh thu,
              mở rộng khách hàng và nâng cao uy tín thương hiệu trên thị
              trường.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-10 mt-10">
              
              <div className="flex flex-wrap items-center gap-5">
                <p>Thẻ phổ biến :</p>

                <ul className="flex flex-wrap items-center gap-3.5">
                  <li>
                    <a
                      className="inline-flex hover:text-white border border-gray-3 bg-white py-2 px-4 rounded-md ease-out duration-200 hover:bg-blue hover:border-blue"
                      href="#"
                    >
                      Máy tính bàn
                    </a>
                  </li>

                  <li>
                    <a
                      className="inline-flex hover:text-white border border-gray-3 bg-white py-2 px-4 rounded-md ease-out duration-200 hover:bg-blue hover:border-blue"
                      href="#"
                    >
                      Macbook
                    </a>
                  </li>

                  <li>
                    <a
                      className="inline-flex hover:text-white border border-gray-3 bg-white py-2 px-4 rounded-md ease-out duration-200 hover:bg-blue hover:border-blue"
                      href="#"
                    >
                      PC
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social icons giữ nguyên */}
              <div className="flex items-center gap-3">
                {/* icons */}
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;