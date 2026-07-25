import Image from "next/image";
import React from "react";

const Brand = () => {
  const brandList = [
    { src: "/logo/roccat.png", alt: "roccat" },
    { src: "/logo/msi.png", alt: "msi" },
    { src: "/logo/razer.png", alt: "razer" },
    { src: "/logo/thermaltake.png", alt: "thermaltake" },
    { src: "/logo/adata.png", alt: "adata" },
    { src: "/logo/hp.png", alt: "hp" },
    { src: "/logo/gigabyte.png", alt: "gigabyte" },
  ];

  return (
    <div
      className="flex justify-between items-center flex-wrap"
      style={{ gap: "16px" }}
    >
      {brandList.map((brand, index) => (
        <div
          key={`${brand.alt}-${index}`}
          className="flex items-center justify-center bg-slate-50/40 border border-slate-100/80 rounded-xl cursor-pointer transition-all duration-300 hover:bg-white hover:border-blue-200/50 hover:shadow-sm hover:-translate-y-0.5"
          style={{ padding: "8px 16px" }}
        >
          <Image
            src={brand.src}
            alt={brand.alt}
            width={120} // Giảm kích thước ảnh thực tế xuống chút để logo hiển thị cân đối trong thẻ
            height={60}
            className="object-contain h-10 w-auto filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          />
        </div>
      ))}
    </div>
  );
};

export default Brand;
