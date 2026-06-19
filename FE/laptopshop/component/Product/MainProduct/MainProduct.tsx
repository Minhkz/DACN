"use client";

import React from "react";
import SeriesProduct from "./SeriesProduct";

const MainProduct = () => {
  return (
    <div
      className="container-global mx-auto max-w-7xl flex flex-col"
      style={{ marginTop: "24px", marginBottom: "48px", gap: "28px" }}
    >
      {/* ===== Category 1: Custom Builds ===== */}
      <SeriesProduct
        banner={{
          src: "/product/banner/custom_build.png",
          title: "Custom Builds",
        }}
        type="custom-build"
      />

      <div
        className="border-b border-slate-100/50"
        style={{ margin: "12px 0" }}
      />

      {/* ===== Category 2: MSI Laptops ===== */}
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

      <div
        className="border-b border-slate-100/50"
        style={{ margin: "12px 0" }}
      />

      {/* ===== Category 3: MSI Desktops ===== */}
      <SeriesProduct
        banner={{
          src: "/product/banner/msi_desktop.png",
          title: "MSI Desktops",
        }}
        series={[
          "MSI Infinite Series",
          "MSI Trident",
          "MSI GL Series",
          "MSI Nightblade",
        ]}
        type="desktop"
      />

      <div
        className="border-b border-slate-100/50"
        style={{ margin: "12px 0" }}
      />

      {/* ===== Category 4: MSI Monitors ===== */}
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
