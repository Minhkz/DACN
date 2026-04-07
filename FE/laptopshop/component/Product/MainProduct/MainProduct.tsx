import React from "react";
import SeriesProduct from "./SeriesProduct";

const MainProduct = () => {
  return (
    <div
      className="container-global"
      style={{ marginTop: "14px", marginBottom: "35px" }}
    >
      <SeriesProduct
        banner={{
          src: "/product/banner/custom_build.png",
          title: "Custom Builds",
        }}
        product={{} as any}
      />
      <SeriesProduct
        banner={{
          src: "/product/banner/msi_laptop.png",
          title: "MSI Laptops",
        }}
        product={{} as any}
        series={[
          "MSI GS Series",
          "MSI GT Series",
          "MSI GL Series",
          "MSI GE Series",
        ]}
      />
      <SeriesProduct
        banner={{
          src: "/product/banner/msi_desktop.png",
          title: "MSI Desktops",
        }}
        product={{} as any}
        series={[
          "MSI Infinute Series",
          "MSI Triden",
          "MSI GL Series",
          "MSI Nightblade",
        ]}
      />
      <SeriesProduct
        banner={{
          src: "/product/banner/msi_monitors.png",
          title: "MSI Monitors",
        }}
        product={{} as any}
      />
    </div>
  );
};

export default MainProduct;
