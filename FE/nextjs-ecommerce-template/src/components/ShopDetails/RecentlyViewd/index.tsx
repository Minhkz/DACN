"use client";
import React from "react";
import shopData from "@/components/Shop/shopData";
import ProductItem from "@/components/Common/ProductItem";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef } from "react";
import "swiper/css/navigation";
import "swiper/css";

const RecentlyViewedItems = () => {
  const sliderRef = useRef<any>(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <section className="overflow-hidden pt-17.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">

        <div className="swiper categories-carousel common-carousel">

          {/* Title */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
                <Image
                  src="/images/icons/icon-05.svg"
                  width={17}
                  height={17}
                  alt="icon"
                />
                Sản phẩm
              </span>

              <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
                Sản phẩm đã xem gần đây
              </h2>
            </div>

            {/* Button slider */}
            <div className="flex items-center gap-3">

              <button onClick={handlePrev} className="swiper-button-prev">
                ◀
              </button>

              <button onClick={handleNext} className="swiper-button-next">
                ▶
              </button>

            </div>
          </div>

          {/* Slider */}
          <Swiper
            ref={sliderRef}
            slidesPerView={4}
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
          >
            {shopData.map((item, key) => (
              <SwiperSlide key={key}>
                <ProductItem item={item} />
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      </div>
    </section>
  );
};

export default RecentlyViewedItems;