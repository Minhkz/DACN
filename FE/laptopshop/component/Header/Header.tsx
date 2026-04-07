"use client";
import React, { Children, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "./Header.module.css";
import { NavItem } from "@/types/header/menu/MenuType";
import MegaMenu from "./menu/MegaMenu";

const TimeClock = dynamic(() => import("./TimeClock"), { ssr: false });

const Header = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(true);
  const [activeMega, setActiveMega] = useState<NavItem | null>(null);
  const [infoCart, setInfoCart] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      label: "Laptops",
      href: "/laptops",
      children: [
        { label: "Everyday Use Notebooks", href: "/catalogs" },
        { label: "MSI Workstation Series", href: "#" },
        { label: "MSI Prestige Series", href: "#" },
        { label: "Gaming Notebooks", href: "#" },
        { label: "Tablets And Pads", href: "#" },
        { label: "Netbooks", href: "#" },
        { label: "Infinity Gaming Notebooks", href: "#" },
      ],
      mega: {
        products: [],
      },
    },
    { label: "Desktop PCs", href: "/desktop-pcs" },
    { label: "Networking Devices", href: "/networking" },
    { label: "Printers & Scanners", href: "/printers-scanners" },
    { label: "PC Parts", href: "/pc-parts" },
    { label: "All Other Products", href: "/products" },
    { label: "Repairs", href: "/repairs" },
  ];

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div>
      {/* TOP BAR */}
      <div className={styles.topbar}>
        <div
          className={`container-global flex justify-between items-center ${styles.topbarInner}`}
          style={{ height: "100%" }}
        >
          <div className={styles.time}>
            <TimeClock />
          </div>

          <div className={styles.address}>
            <p>
              Số 298 đường Cầu Diễn, phường Tây Tựu, quận Bắc Từ Liêm, Hà Nội
            </p>
          </div>

          <div className={`flex justify-between gap-2 ${styles.contact}`}>
            <p>Hotline: 0986.84.3838</p>
            <Image src="/icon/fb.png" alt="Facebook" width={20} height={20} />
            <Image
              src="/icon/inta.png"
              alt="Instagram"
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>

      {/* NAV */}
      <div className={styles.navbar}>
        <div className="container-global flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo/Logo.svg" alt="Logo" width={85} height={69} />
          </Link>

          {/* Desktop Menu */}
          <div
            className={styles.navHoverZone}
            onMouseLeave={() => {
              setMegaOpen(false);
              setActiveMega(null);
            }}
          >
            {/* NAVBAR */}
            <div className={styles.navbar}>
              <div className="container-global flex items-center justify-between h-[68px]">
                <nav className={styles.desktopMenu}>
                  {navItems.map((item) => {
                    const hasMega = !!item.mega;

                    return (
                      <div
                        key={item.href}
                        className={styles.menuItem}
                        onMouseEnter={() => {
                          if (hasMega) {
                            setActiveMega(item);
                            setMegaOpen(true);
                          } else {
                            setMegaOpen(false);
                            setActiveMega(null);
                          }
                        }}
                      >
                        <Link href={item.href}>{item.label}</Link>
                      </div>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* MEGA MENU */}
            <MegaMenu item={activeMega} open={megaOpen} />
          </div>
          {/* Right icons + hamburger */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 hover:bg-black/5 rounded-full">
              <Image
                src="/icon/search.png"
                alt="Search"
                width={19}
                height={19}
              />
            </button>

            <div
              className="relative"
              onMouseEnter={() => setInfoCart(true)}
              onMouseLeave={() => setInfoCart(false)}
            >
              {/* CART ICON */}
              <Link
                href="/cart"
                className="relative p-2 hover:bg-black/5 rounded-full block"
              >
                <Image
                  src="/icon/shopping-cart.png"
                  alt="Cart"
                  width={25}
                  height={25}
                />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  2
                </span>
              </Link>

              {/* MINI CART */}
              <div
                className={`
                    absolute right-[-10px] top-[35px] mt-3 z-50
                    transition-all duration-200 ease-out
                    ${
                      infoCart
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }
                  `}
              >
                {/* ARROW */}
                <div
                  className="absolute -top-2 right-4
                    h-0 w-0
                    border-l-8 border-r-8 border-b-8
                    border-l-transparent border-r-transparent border-b-white
                    drop-shadow-[0_-2px_2px_rgba(0,0,0,0.08)]"
                />

                {/* CART BOX */}
                <div className="w-[310px] rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)] overflow-hidden font-sans">
                  {/* HEADER */}
                  <div className="px-5 pt-5 pb-3 text-center">
                    <h3 className="text-lg font-semibold">My Cart</h3>
                    <p className="mt-1 text-sm text-gray-500">2 item in cart</p>
                  </div>

                  {/* VIEW CART BUTTON */}
                  <div className="px-5 pb-4">
                    <button className="w-full rounded-full border-2 border-blue-600 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition">
                      View or Edit Your Cart
                    </button>
                  </div>

                  {/* ITEMS */}
                  <div className="border-y border-gray-200"></div>

                  {/* FOOTER */}
                  <div className="px-5 py-4">
                    <div className="mb-4 flex items-center justify-between text-sm">
                      <span className="text-gray-500">Subtotal:</span>
                      <span className="font-semibold text-gray-900">
                        $499.00
                      </span>
                    </div>

                    <button className="mb-3 w-full rounded-full bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
                      Go to Checkout
                    </button>

                    <button className="w-full rounded-full bg-yellow-400 py-2.5 text-sm font-semibold hover:bg-yellow-500 transition">
                      Check out with PayPal
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setAccountOpen(true)}
              onMouseLeave={() => setAccountOpen(false)}
            >
              <Link href="/account">
                <Image
                  src="/icon/Ellipse.png"
                  alt="User"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              </Link>

              <div
                className={`
                  absolute right-[-15px] top-[48px] mt-2 z-50
                  transition-all duration-150
                  ${
                    accountOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-1 pointer-events-none"
                  }
                `}
              >
                {/* BOX (arrow gắn trực tiếp vào đây) */}
                <div
                  className="
                    relative
                    w-[240px]
                    bg-white
                    border border-gray-300
                    shadow-sm
                    text-[18px]
                  "
                >
                  {/* ARROW – LIỀN */}
                  <div
                    className="
                      absolute -top-[9px] right-6
                      w-4 h-4
                      bg-white
                      border-l border-t border-gray-300
                      rotate-45
                    "
                  />

                  <ul>
                    <li className="px-6 py-4 hover:bg-gray-100 cursor-pointer">
                      My Account
                    </li>
                    <li className="px-6 py-4 hover:bg-gray-100 cursor-pointer">
                      My Wish List (0)
                    </li>
                    <li className="px-6 py-4 hover:bg-gray-100 cursor-pointer">
                      Compare (0)
                    </li>
                    <li className="px-6 py-4 hover:bg-gray-100 cursor-pointer">
                      Create an Account
                    </li>
                    <li className="px-6 py-4 hover:bg-gray-100 cursor-pointer">
                      Sign In
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Hamburger */}
            <button
              className={`p-2 hover:bg-black/5 rounded-full ${styles.hamburger} `}
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Image src="/icon/menu.png" alt="Menu" width={32} height={32} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <>
          <div className={styles.overlay} onClick={() => setOpen(false)} />
          <div className={styles.panel} role="dialog" aria-modal="true">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-lg">Menu</p>
              <button
                className="p-2 hover:bg-black/5 rounded-full"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.menuItem} ${isActive ? styles.activeItem : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Link href="/deals" className={styles.dealBtn}>
                Our Deals
              </Link>

              <Link href="/account" className={`${styles.menuItem} mt-2`}>
                Account
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
