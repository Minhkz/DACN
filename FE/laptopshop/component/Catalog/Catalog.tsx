"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Breadcrumb } from "antd";
import styles from "./Catalog.module.css";
import Link from "next/link";
import BrandFilter from "./Brand/BrandFilter";
import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import FilterTag from "./FilterTag";
import ListView from "./ListView/ListView";
import GridView from "./GridView/GridView";

const Catalog = () => {
  const searchParams = useSearchParams();
  const label = searchParams.get("label");
  const [view, setView] = useState<"grid" | "list">("grid");
  return (
    <div>
      <div className="container-global">
        <div className="banner">
          <Image
            src="/img/catalog_banner.png"
            alt="Catalog Banner"
            width={1398}
            height={104}
          />
        </div>

        <div className={styles.breadcrumb}>
          <Breadcrumb
            items={[
              {
                title: "Home",
                href: "/",
              },
              {
                title: "Laptops",
                href: "/laptops",
              },

              {
                title: label,
              },
            ]}
          />
        </div>
        <div className="type">
          <h1 className="font-semibold text-[32px]">{label}(20)</h1>
        </div>
        <div className={styles.main} style={{ margin: "20px 0" }}>
          <div className={styles.left}>
            <div className="left--top text-center h-12.5 hidden lg:block">
              <Link href="/">‹ Back</Link>
            </div>
            <div className="left--main hidden lg:block">
              <div className="filter ">
                <aside className={styles.sidebar}>
                  <h3 className={styles.title}>Filters</h3>

                  <button className={styles.clearBtn}>Clear Filter</button>

                  {/* Category */}
                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <span>Category</span>
                    </div>

                    <ul className={styles.list}>
                      <li>
                        <span>CUSTOM PCS</span>
                        <span>15</span>
                      </li>
                      <li>
                        <span>MSI ALL-IN-ONE PCS</span>
                        <span>45</span>
                      </li>
                      <li>
                        <span>HP/COMPAQ PCS</span>
                        <span>1</span>
                      </li>
                    </ul>
                  </div>

                  {/* Price */}
                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <span>Price</span>
                    </div>

                    <ul className={styles.list}>
                      <li>
                        <span>$0.00 - $1,000.00</span>
                        <span>19</span>
                      </li>
                      <li>
                        <span>$1,000.00 - $2,000.00</span>
                        <span>21</span>
                      </li>
                      <li>
                        <span>$2,000.00 - $3,000.00</span>
                        <span>9</span>
                      </li>
                      <li>
                        <span>$3,000.00 - $4,000.00</span>
                        <span>6</span>
                      </li>
                      <li>
                        <span>$4,000.00 - $5,000.00</span>
                        <span>3</span>
                      </li>
                      <li>
                        <span>$5,000.00 - $6,000.00</span>
                        <span>1</span>
                      </li>
                      <li>
                        <span>$6,000.00 - $7,000.00</span>
                        <span>1</span>
                      </li>
                      <li>
                        <span>$7,000.00 And Above</span>
                        <span>1</span>
                      </li>
                    </ul>
                  </div>

                  {/* Color */}
                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <span>Color</span>
                    </div>

                    <div className={styles.colors}>
                      <div className={`${styles.color} ${styles.black}`} />
                      <div className={`${styles.color} ${styles.red}`} />
                    </div>
                  </div>

                  <button className={styles.applyBtn}>Apply Filters (2)</button>
                </aside>
              </div>
              <div className="brand">
                <BrandFilter />
              </div>
              <div
                className="compare-product bg-[#f5f7ff] h-27 "
                style={{ marginBottom: "7px" }}
              >
                <h3 className={styles.title}>Compare Products</h3>
                <p className="text-center">You have no items to compare.</p>
              </div>

              <div
                className="wishlist bg-[#f5f7ff] h-27 "
                style={{ marginBottom: "7px" }}
              >
                <h3 className={styles.title}>Wishlist</h3>
                <p className="text-center">
                  You have no items in your wishlist.
                </p>
              </div>

              <Image
                src="/img/catalog.png"
                alt="Catalog Sidebar"
                width={234}
                height={370}
              />
            </div>
          </div>
          <div className="right w-full">
            <div className={styles.toolbar}>
              <div className={styles.toolbarLeft}>Items 1-35 of 61</div>

              <div className={styles.toolbarRight}>
                <div className={styles.selectBox}>
                  <span>Sort By:</span>
                  <select>
                    <option>Position</option>
                    <option>Price Low to High</option>
                    <option>Price High to Low</option>
                    <option>Name</option>
                  </select>
                </div>

                <div className={styles.selectBox}>
                  <span>Show:</span>
                  <select>
                    <option>12 per page</option>
                    <option>24 per page</option>
                    <option>35 per page</option>
                    <option>50 per page</option>
                  </select>
                </div>

                <div className={styles.viewToggle}>
                  <button
                    className={view === "grid" ? styles.active : ""}
                    onClick={() => setView("grid")}
                  >
                    <LayoutGrid size={18} />
                  </button>

                  <button
                    className={view === "list" ? styles.active : ""}
                    onClick={() => setView("list")}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>
            <div className="select-type" style={{ marginBottom: "20px" }}>
              <FilterTag />
            </div>
            <div className="view">
              {view === "grid" ? <GridView /> : <ListView />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
