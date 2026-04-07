"use client";
import Image from "next/image";
import CardProduct from "../CardProduct/CardProduct";
import styles from "./NewProduct.module.css";
import { Carousel } from "antd";
import { useState } from "react";
import Dialog from "@/component/Modal/Dialog";
const NewProduct = () => {
  const [openAll, setOpenAll] = useState<boolean>(false);
  return (
    <div className="container-global">
      <div className={`flex justify-between items-center ${styles.title}`}>
        <h2 className="text-[22px] font-bold text-[#000000]">Sản phẩm mới</h2>
        <p
          className="text-[13px] text-[#0156FF] font-normal cursor-pointer"
          onClick={() => setOpenAll(true)}
        >
          Xem tất cả
        </p>
      </div>
      <Carousel
        infinite={true}
        autoplay
        autoplaySpeed={2000}
        draggable
        dots={false}
        slidesToShow={6}
        slidesToScroll={1}
        responsive={[
          { breakpoint: 1280, settings: { slidesToShow: 5 } },
          { breakpoint: 1024, settings: { slidesToShow: 4 } },
          { breakpoint: 768, settings: { slidesToShow: 2 } },
          { breakpoint: 480, settings: { slidesToShow: 1 } },
        ]}
      >
        <CardProduct />
        <CardProduct />
        <CardProduct />
        <CardProduct />
        <CardProduct />
        <CardProduct />
        <CardProduct />
      </Carousel>
      <div className="zip flex items-center justify-center gap-4 h-[70px] bg-[#F5F7FF] mt-3 px-4 py-3 rounded-md">
        <div className="zip--img">
          <Image src="/img/zip.png" alt="zip" width={77} height={27} />
        </div>

        <Image src="/img/Vector.png" alt="arrow-right" width={2} height={23} />

        <div className="text-[#272560] text-[18px] font-normal">
          Sở hữu ngay hôm nay, trả góp không lãi suất lên đến 6 tháng.
          <span className="ml-1 underline cursor-pointer">Tìm hiểu thêm</span>
        </div>
      </div>

      <Dialog open={openAll} onClose={() => setOpenAll(false)} />
    </div>
  );
};
export default NewProduct;
