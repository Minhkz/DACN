"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Brand.module.css";

const brands = [
  { name: "roccat", img: "/logo/roccat.png" },
  { name: "msi", img: "/logo/msi.png" },
  { name: "razer", img: "/logo/razer.png" },
  { name: "thermaltake", img: "/logo/thermaltake.png" },
  { name: "adata", img: "/logo/adata.png" },
  { name: "hp", img: "/logo/hp.png" },
  { name: "gigabyte", img: "/logo/gigabyte.png" },
];

export default function BrandFilter() {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const clearBrands = () => {
    setSelectedBrands([]);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <h3 className={styles.title}>Brands</h3>
        <button className={styles.clearBtn} onClick={clearBrands}>
          All Brands
        </button>
      </div>

      <div className={styles.brandGrid}>
        {brands.map((brand) => (
          <div
            key={brand.name}
            onClick={() => toggleBrand(brand.name)}
            className={`${styles.brandItem} ${
              selectedBrands.includes(brand.name) ? styles.active : ""
            }`}
          >
            <Image src={brand.img} alt={brand.name} width={118} height={79} />
          </div>
        ))}
      </div>
    </div>
  );
}
