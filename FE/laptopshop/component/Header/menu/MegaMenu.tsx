"use client";

import React, { useEffect, useState } from "react";
import styles from "./MegaMenu.module.css";
import { NavItem } from "@/types/header/menu/MenuType";
import Brand from "@/component/Brand/Brand";
import CardProduct from "@/component/Product/CardProduct/CardProduct";
import Link from "next/link";
import { ProductDetailDto } from "@/types/product/ProductDetailDto";
import { useQuery } from "@tanstack/react-query";
import { getProductByType } from "@/services/product/ProductApi";
import { Spin } from "antd";

type Props = {
  item: NavItem | null;
  open: boolean;
};

const MegaMenu = ({ item, open }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [item]);

  const activeChild = item?.children?.[activeIndex];

  const { data: products = [], isLoading: isProductsLoading } = useQuery<
    ProductDetailDto[]
  >({
    queryKey: ["products-by-type", activeChild?.slug],
    queryFn: () => getProductByType(activeChild?.slug as string),
    enabled: !!activeChild?.slug && open,
    staleTime: 1000 * 60 * 5,
  });

  const visibleProducts = products.slice(0, 4);

  if (!item || !item.children?.length) return null;

  return (
    <div className={`${styles.megaOverlay} ${open ? styles.open : ""}`}>
      <div className="container-global">
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <ul className={styles.category}>
              {item.children.map((child, index) => (
                <li
                  key={`${child.href}-${index}`}
                  className={`${styles.categoryItem} ${
                    index === activeIndex ? styles.active : ""
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <Link href={child.href} className={styles.fullLink}>
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className={styles.products}>
              {isProductsLoading ? (
                <div className="col-span-4 flex justify-center items-center h-[200px]">
                  <Spin size="large" />
                </div>
              ) : visibleProducts.length > 0 ? (
                visibleProducts.map((product) => (
                  <CardProduct key={product.id} product={product} />
                ))
              ) : (
                <div className={styles.stateBox}>
                  <p className={styles.emptyText}>Không có sản phẩm</p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.brand}>
            <Brand />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
