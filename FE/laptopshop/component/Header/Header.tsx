"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "./Header.module.css";
import { NavItem } from "@/types/header/menu/MenuType";
import MegaMenu from "./menu/MegaMenu";
import axios from "axios";
import { me } from "@/services/user/UserApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const TimeClock = dynamic(() => import("./TimeClock"), { ssr: false });

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(true);
  const [activeMega, setActiveMega] = useState<NavItem | null>(null);
  const [infoCart, setInfoCart] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [cartTimeout, setCartTimeout] = useState<NodeJS.Timeout | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: me,
    staleTime: 0,
    retry: false,
  });

  const isLoggedIn = !!data && !isError;

  async function handleSignOut() {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      await axios.post("/api/auth/logout");

      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await queryClient.setQueryData(["user"], null);

      setAccountOpen(false);
      router.replace("/signin");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  }

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
              onMouseEnter={() => {
                if (cartTimeout) clearTimeout(cartTimeout);
                setInfoCart(true);
              }}
              onMouseLeave={() => setCartTimeout(setTimeout(() => setInfoCart(false), 200))}
            >
              <Link
                href="/cart"
                onClick={() => router.push('/cart')}
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
                <div
                  className="absolute -top-2 right-4
                  h-0 w-0
                  border-l-8 border-r-8 border-b-8
                  border-l-transparent border-r-transparent border-b-white
                  drop-shadow-[0_-2px_2px_rgba(0,0,0,0.08)]"
                />

                <div 
                  onMouseEnter={() => {
                    if (cartTimeout) clearTimeout(cartTimeout);
                    setInfoCart(true);
                  }}
                  className="w-[200px] rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-2xl border border-gray-100 overflow-hidden font-sans transform transition-all duration-300 ease-out hover:shadow-3xl"
                >
                  <div className="px-5 pt-5 pb-3 text-center bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">My Cart</h3>
                    <p className="text-sm text-gray-600">2 items in cart</p>
                  </div>

                  <div className="px-5 pb-4">
                    <button 
                      onClick={() => {
                        router.push('/cart');
                        setInfoCart(false);
                      }}
                      className="w-full rounded-full border-2 border-blue-500 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      View or Edit Your Cart
                    </button>
                  </div>

                  <div className="border-y border-gray-200 bg-gray-50"></div>

                  <div className="px-5 py-4">
                    <div className="mb-4 flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-medium">Subtotal:</span>
                      <span className="font-bold text-gray-900 text-base">
                        $499.00
                      </span>
                    </div>

                    <button className="mb-3 w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-700 py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Go to Checkout
                    </button>

                    <button className="w-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-2.5 text-sm font-semibold text-gray-800 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
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
              <Link href={isLoggedIn ? "/profile" : "/signin"}>
                <Image
                  src={data?.avatar || "/icon/Ellipse.png"}
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
                  <div
                    className="
                      absolute -top-[9px] right-6
                      w-4 h-4
                      bg-white
                      border-l border-t border-gray-300
                      rotate-45
                    "
                  />

                  <ul className="w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden p-1">
                    <li className="group flex items-center px-6 py-4 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer border-b border-gray-50 dark:border-gray-700">
                      <Link
                        href="/account"
                        className="w-full text-gray-700 dark:text-gray-200 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      >
                        My Account
                      </Link>
                    </li>

                    <li className="group flex items-center justify-between px-6 py-4 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer border-b border-gray-50 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-200 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        My Wish List
                      </span>
                      <span className="bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300 text-xs font-bold px-2.5 py-0.5 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600">
                        0
                      </span>
                    </li>

                    <li className="group flex items-center justify-between px-6 py-4 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer border-b border-gray-50 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-200 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        Compare
                      </span>
                      <span className="bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300 text-xs font-bold px-2.5 py-0.5 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600">
                        0
                      </span>
                    </li>

                    {isLoading ? (
                      <li className="px-6 py-4 text-gray-500 border-b border-gray-50 dark:border-gray-700">
                        Đang tải...
                      </li>
                    ) : !isLoggedIn ? (
                      <li className="group flex items-center px-6 py-4 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all cursor-pointer border-b border-gray-50 dark:border-gray-700">
                        <Link
                          href="/signin"
                          className="flex items-center w-full h-full"
                        >
                          <span className="text-gray-700 dark:text-gray-200 font-medium group-hover:text-blue-600">
                            Đăng nhập
                          </span>
                        </Link>
                      </li>
                    ) : (
                      <li className="border-b border-gray-50 dark:border-gray-700">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          disabled={isSigningOut}
                          className="group flex items-center w-full px-6 py-4 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <svg
                            className="mr-3 fill-gray-500 group-hover:fill-red-500 transition-colors"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                          >
                            <path d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-200 font-medium group-hover:text-red-600">
                            {isSigningOut ? "Đang đăng xuất..." : "Đăng xuất"}
                          </span>
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <button
              className={`p-2 hover:bg-black/5 rounded-full ${styles.hamburger}`}
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
                    className={`${styles.menuItem} ${
                      isActive ? styles.activeItem : ""
                    }`}
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
