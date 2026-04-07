import React, { useState } from "react";
import styles from "./MegaMenu.module.css";
import { NavItem } from "@/types/header/menu/MenuType";
import Brand from "@/component/Brand/Brand";
import CardProduct from "@/component/Product/CardProduct/CardProduct";
import Link from "next/link";

type Props = {
  item: NavItem | null;
  open: boolean;
};

const MegaMenu = ({ item, open }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!item?.mega) return null;

  return (
    <div className={`${styles.megaOverlay} ${open ? styles.open : ""}`}>
      <div className="container-global">
        <div className={styles.wrapper}>
          {/* CONTENT */}
          <div className={styles.content}>
            <ul className={styles.category}>
              {item.children?.map((child, index) => (
                <li
                  key={`${child.href}+${index}`}
                  className={`${styles.categoryItem} ${
                    index === activeIndex ? styles.active : ""
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <Link
                    href={{
                      pathname: child.href,
                      query: { label: child.label },
                    }}
                    className={styles.fullLink}
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* PRODUCTS */}
            <div className={styles.products}>
              <CardProduct />
              <CardProduct />
              <CardProduct />
              <CardProduct />
            </div>
          </div>

          {/* BRANDS */}
          <div className={styles.brand}>
            <Brand />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
