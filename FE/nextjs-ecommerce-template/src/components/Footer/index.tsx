"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-1 pt-20">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16">

          {/* Hỗ trợ */}
          <div>
            <h3 className="text-lg font-medium text-dark mb-6">
              Hỗ trợ & Trợ giúp
            </h3>

            <p className="mb-4">
              298 Cầu Giấy, Hà Nội, Việt Nam
            </p>

            <p className="mb-2">
              Email: support@laptopstore.vn
            </p>

            <p>Hotline: 0123 456 789</p>
          </div>

          {/* Tài khoản */}
          <div>
            <h3 className="text-lg font-medium text-dark mb-6">
              Tài khoản
            </h3>

            <ul className="flex flex-col gap-3">
              <li>
                <Link href="#" className="hover:text-blue">
                  Tài khoản của tôi
                </Link>
              </li>

              <li>
                <Link href="/signin" className="hover:text-blue">
                  Đăng nhập / Đăng ký
                </Link>
              </li>

              <li>
                <Link href="/cart" className="hover:text-blue">
                  Giỏ hàng
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:text-blue">
                  Danh sách yêu thích
                </Link>
              </li>

              <li>
                <Link href="/shop" className="hover:text-blue">
                  Cửa hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h3 className="text-lg font-medium text-dark mb-6">
              Liên kết nhanh
            </h3>

            <ul className="flex flex-col gap-3">
              <li>
                <Link href="#" className="hover:text-blue">
                  Chính sách bảo mật
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:text-blue">
                  Chính sách hoàn tiền
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:text-blue">
                  Điều khoản sử dụng
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:text-blue">
                  Câu hỏi thường gặp
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-blue">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Tải ứng dụng */}
          <div>
            <h3 className="text-lg font-medium text-dark mb-6">
              Tải ứng dụng
            </h3>

            <p className="mb-4">
              Giảm 3$ khi tải ứng dụng cho người dùng mới
            </p>

            <div className="flex flex-col gap-4">
              <a href="#">
                <Image
                  src="/images/footer/appstore.png"
                  alt="App Store"
                  width={140}
                  height={40}
                />
              </a>

              <a href="#">
                <Image
                  src="/images/footer/googleplay.png"
                  alt="Google Play"
                  width={140}
                  height={40}
                />
              </a>
            </div>
          </div>

        </div>

        {/* Footer dưới */}
        <div className="border-t border-gray-3 py-6 flex flex-col md:flex-row justify-between items-center">

          <p className="text-sm">
            © {year} Bản quyền thuộc về Laptop Store
          </p>

          <div className="flex items-center gap-3">
            <span>Phương thức thanh toán:</span>

            <Image
              src="/images/footer/payment.png"
              alt="payment"
              width={200}
              height={20}
            />
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;