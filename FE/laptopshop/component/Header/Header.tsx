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
import { ProductDetailDto } from "@/types/product/ProductDetailDto";
import { getProductByType } from "@/services/product/ProductApi";
import { Spin } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearWishlist, fetchWishlist } from "@/store/slices/wishlistSlice";
import { setUserId } from "@/store/slices/authSlice";
import { fetchCart } from "@/store/slices/cartSlice";

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
  const dispatch = useAppDispatch();

  const wishlistCount = useAppSelector(
    (s) => s.wishlist.wishlist?.items?.length ?? 0,
  );

  const cartCount = useAppSelector((s) => s.cart.cart?.items?.length ?? 0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: me,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const userId = data?.id;

  useEffect(() => {
    if (userId != null) {
      dispatch(setUserId(userId));
      dispatch(fetchWishlist());
      dispatch(fetchCart());
    }
  }, [userId, dispatch]);

  const isLoggedIn = !!data && !isError;

  async function handleSignOut() {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      await axios.post("/api/auth/logout");

      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await queryClient.setQueryData(["user"], null);

      dispatch(clearWishlist());

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
      label: "MSI Products",
      href: "/categories",
      children: [
        {
          label: "Custom Builds",
          href: "/categories?type=custom-build",
          slug: "custom-build",
        },
        {
          label: "MSI Laptops",
          href: "/categories?type=laptop",
          slug: "laptop",
        },
        {
          label: "MSI Desktops",
          href: "/categories?type=desktop",
          slug: "desktop",
        },
        {
          label: "MSI Monitors",
          href: "/categories?type=monitor",
          slug: "monitor",
        },
      ],
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
                    const hasMega = !!item.children?.length;

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
              onMouseLeave={() =>
                setCartTimeout(setTimeout(() => setInfoCart(false), 200))
              }
            >
              <Link
                href="/cart"
                onClick={() => router.push("/cart")}
                className="relative p-2 hover:bg-black/5 rounded-full block"
              >
                <Image
                  src="/icon/shopping-cart.png"
                  alt="Cart"
                  width={25}
                  height={25}
                />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
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
                  style={{ width: "220px" }}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Header */}
                  <div
                    className="border-b border-gray-100"
                    style={{ padding: "14px 16px 12px" }}
                  >
                    <p
                      className="text-sm font-medium text-gray-800"
                      style={{ margin: "0 0 2px" }}
                    >
                      My cart
                    </p>
                    <p className="text-xs text-gray-400" style={{ margin: 0 }}>
                      {cartCount} items
                    </p>
                  </div>

                  {/* View cart button */}
                  <div
                    className="border-b border-gray-100"
                    style={{ padding: "12px 16px" }}
                  >
                    <button
                      onClick={() => {
                        router.push("/cart");
                        setInfoCart(false);
                      }}
                      className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      style={{ padding: "8px 0" }}
                    >
                      View or edit your cart
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div
                    className="flex items-center justify-between border-b border-gray-100"
                    style={{ padding: "12px 16px" }}
                  >
                    <span className="text-xs text-gray-400">Subtotal</span>
                    <span className="text-sm font-medium text-gray-800">
                      $499.00
                    </span>
                  </div>

                  {/* Actions */}
                  <div
                    className="flex flex-col"
                    style={{ padding: "12px 16px", gap: "8px" }}
                  >
                    <button
                      className="w-full text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                      style={{ padding: "8px 0" }}
                    >
                      Go to checkout
                    </button>

                    <button
                      className="w-full text-sm font-medium text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors flex items-center justify-center"
                      style={{ padding: "8px 0", gap: "6px" }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.568 6.243-8.148 6.243h-2.19l-1.264 8.013H12.9l.163-1.027.893-5.656.057-.352h.371c4.494 0 7.347-1.987 8.254-6.31.148-.7.183-1.29.138-1.824z" />
                      </svg>
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
                className={`absolute z-50 transition-all duration-150 ${
                  accountOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-1 pointer-events-none"
                }`}
                style={{ right: "-12px", top: "calc(100% + 10px)" }}
              >
                {/* Mũi tên caret */}
                <div
                  className="absolute bg-white border-l border-t border-gray-200"
                  style={{
                    top: "-5px",
                    right: "18px",
                    width: "10px",
                    height: "10px",
                    transform: "rotate(45deg)",
                  }}
                />

                <ul
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                  style={{ width: "220px", padding: "4px 0" }}
                >
                  {/* My Account */}
                  <li className="border-b border-gray-100">
                    <Link
                      href="/account"
                      className="flex items-center gap-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                      style={{ padding: "10px 16px", fontSize: "14px" }}
                    >
                      My Account
                    </Link>
                  </li>

                  {/* My Wish List */}
                  <li className="border-b border-gray-100">
                    <Link
                      href="/wishlist"
                      className="flex items-center justify-between text-gray-700 hover:bg-gray-50 transition-colors"
                      style={{ padding: "10px 16px", fontSize: "14px" }}
                    >
                      <span>My Wish List</span>
                      <span
                        className="text-gray-400 font-medium"
                        style={{
                          fontSize: "11px",
                          padding: "1px 7px",
                          background: "#f3f4f6",
                          borderRadius: "99px",
                        }}
                      >
                        {wishlistCount}
                      </span>
                    </Link>
                  </li>

                  {/* Compare */}
                  <li className="border-b border-gray-100">
                    <div
                      className="flex items-center justify-between text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{ padding: "10px 16px", fontSize: "14px" }}
                    >
                      <span>Compare</span>
                      <span
                        className="text-gray-400 font-medium"
                        style={{
                          fontSize: "11px",
                          padding: "1px 7px",
                          background: "#f3f4f6",
                          borderRadius: "99px",
                        }}
                      >
                        0
                      </span>
                    </div>
                  </li>

                  {/* Auth actions */}
                  {isLoading ? (
                    <li style={{ padding: "10px 16px" }}>
                      <Spin size="small" />
                    </li>
                  ) : !isLoggedIn ? (
                    <li>
                      <Link
                        href="/signin"
                        className="flex items-center text-gray-700 hover:bg-gray-50 transition-colors"
                        style={{ padding: "10px 16px", fontSize: "14px" }}
                      >
                        Đăng nhập
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="flex items-center gap-2.5 w-full text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ padding: "10px 16px", fontSize: "14px" }}
                      >
                        <svg
                          className="shrink-0"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z" />
                        </svg>
                        {isSigningOut ? <Spin size="small" /> : "Đăng xuất"}
                      </button>
                    </li>
                  )}
                </ul>
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
