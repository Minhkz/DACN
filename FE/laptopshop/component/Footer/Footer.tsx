"use client";
import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";

const Footer = () => {
  return (
    <div>
      <div className="cskh bg-[#F5F7FF]  md:pt-[60px] md:pb-[45px]">
        <div className="container-global grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-center">
          {/* Product Support */}
          <div className={`${styles.subCskh} flex flex-col items-center`}>
            <div className="w-14 h-14 rounded-full bg-[#0156FF] flex items-center justify-center mb-4">
              <Image
                src="/img/support.png"
                alt="Support Icon"
                width={40}
                height={40}
              />
            </div>

            <h4 className="font-semibold text-black mb-2">Hỗ trợ sản phẩm</h4>
            <p className="text-sm text-gray-600 max-w-xs">
              Bảo hành tận nơi lên đến 3 năm, giúp bạn hoàn toàn yên tâm khi sử
              dụng.
            </p>
          </div>

          {/* Personal Account */}
          <div className={`${styles.subCskh} flex flex-col items-center`}>
            <div className="w-14 h-14 rounded-full bg-[#0156FF] flex items-center justify-center mb-4">
              <Image
                src="/img/account.png"
                alt="Account Icon"
                width={40}
                height={40}
              />
            </div>

            <h4 className="font-semibold text-black mb-2">Tài khoản cá nhân</h4>
            <p className="text-sm text-gray-600 max-w-xs">
              Nhận nhiều ưu đãi lớn, giao hàng miễn phí và có nhân viên hỗ trợ
              riêng.
            </p>
          </div>

          {/* Amazing Savings */}
          <div className={`${styles.subCskh} flex flex-col items-center`}>
            <div className="w-14 h-14 rounded-full bg-[#0156FF] flex items-center justify-center mb-4">
              <Image
                src="/img/saving.png"
                alt="Saving Icon"
                width={40}
                height={40}
              />
            </div>

            <h4 className="font-semibold text-black mb-2">Ưu đãi hấp dẫn</h4>
            <p className="text-sm text-gray-600 max-w-xs">
              Giảm giá lên đến 70% cho sản phẩm mới, đảm bảo mức giá tốt nhất.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#020203]">
        <div className="container-global">
          <div
            className={`${styles.header} flex flex-col lg:flex-row items-center justify-between gap-6 `}
          >
            <div className="text-white">
              <h3 className="text-[26px] font-semibold">
                Đăng ký nhận bản tin của chúng tôi.
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Là người đầu tiên cập nhật những ưu đãi mới nhất.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder=" Email của bạn"
                className="
                w-full lg:w-[391px]
                h-[50px]
                px-4
                rounded-full
                bg-transparent
                border border-gray-500
                text-white
                placeholder-gray-400
                focus:outline-none
                focus:border-white
                transition
                "
              />

              <button
                className="
                h-[50px]
                w-[151px]
                px-6
                rounded-full
                bg-[#0156FF]
                text-white
                font-medium
                hover:bg-blue-600
                transition
                whitespace-nowrap
                "
              >
                Đăng ký
              </button>
            </div>
          </div>
          <div className="content grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-sm text-white">
            {/* Information */}
            <div>
              <h4 className="font-semibold mb-4">Information</h4>
              <ul className="space-y-2">
                <li>About Us</li>
                <li>About Zip</li>
                <li>Privacy Policy</li>
                <li>Search</li>
                <li>Terms</li>
                <li>Orders and Returns</li>
                <li>Contact Us</li>
                <li>Advanced Search</li>
                <li>Newsletter Subscription</li>
              </ul>
            </div>

            {/* PC Parts */}
            <div>
              <h4 className="font-semibold mb-4">PC Parts</h4>
              <ul className="space-y-2">
                <li>CPUs</li>
                <li>Add On Cards</li>
                <li>Hard Drives (Internal)</li>
                <li>Graphic Cards</li>
                <li>Keyboards / Mice</li>
                <li>Cases / Power Supplies / Cooling</li>
                <li>RAM (Memory)</li>
                <li>Software</li>
                <li>Speakers / Headsets</li>
                <li>Motherboards</li>
              </ul>
            </div>

            {/* Desktop PCs */}
            <div>
              <h4 className="font-semibold mb-4">Desktop PCs</h4>
              <ul className="space-y-2">
                <li>Custom PCs</li>
                <li>Servers</li>
                <li>MSI All-in-One PCs</li>
                <li>HP/Compaq PCs</li>
                <li>ASUS PCs</li>
                <li>Tecs PCs</li>
              </ul>
            </div>

            {/* Laptops */}
            <div>
              <h4 className="font-semibold mb-4">Laptops</h4>
              <ul className="space-y-2">
                <li>Everyday Use Notebooks</li>
                <li>MSI Workstation Series</li>
                <li>MSI Prestige Series</li>
                <li>Tablets and Pads</li>
                <li>Notebooks</li>
                <li>Infinity Gaming Notebooks</li>
              </ul>
            </div>

            {/* Address */}
            <div>
              <h4 className="font-semibold mb-4">Address</h4>
              <ul className="space-y-2">
                <li>Address: 1234 Street Address City Address, 1234</li>
                <li>Phones: (00) 1234 5678</li>
                <li>We are open: Monday–Thursday: 9:00 AM – 5:30 PM</li>
                <li>Friday: 9:00 AM – 6:00 PM</li>
                <li>Saturday: 11:00 AM – 5:00 PM</li>
                <li>E-mail: shop@email.com</li>
              </ul>
            </div>
          </div>

          <div className={`${styles.footer} flex justify-between items-center`}>
            <div className={`flex justify-between gap-2 ${styles.contact}`}>
              <Image src="/icon/fb.png" alt="Facebook" width={20} height={20} />
              <Image
                src="/icon/inta.png"
                alt="Instagram"
                width={20}
                height={20}
              />
            </div>
            <div className="">
              <Image
                src="/img/pay.png"
                alt="Payment Methods"
                width={209}
                height={22}
              />
            </div>
            <div className={styles.copyright}>
              Copyright © 2026 Shop Pty. Ltd.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
