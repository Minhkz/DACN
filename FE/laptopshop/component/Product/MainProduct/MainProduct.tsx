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
        type="custom-build"
      />

      <SeriesProduct
        banner={{
          src: "/product/banner/msi_laptop.png",
          title: "MSI Laptops",
        }}
        series={[
          "MSI GS Series",
          "MSI GT Series",
          "MSI GL Series",
          "MSI GE Series",
        ]}
        type="laptop"
      />
      <SeriesProduct
        banner={{
          src: "/product/banner/msi_desktop.png",
          title: "MSI Desktops",
        }}
        series={[
          "MSI Infinute Series",
          "MSI Triden",
          "MSI GL Series",
          "MSI Nightblade",
        ]}
        type="desktop"
      />
      <SeriesProduct
        banner={{
          src: "/product/banner/msi_monitors.png",
          title: "MSI Monitors",
        }}
        type="monitor"
      />
    </div>
  );
};

export default MainProduct;
