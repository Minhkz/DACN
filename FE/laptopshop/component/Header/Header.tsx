"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "./Header.module.css";
import { NavItem } from "@/types/header/menu/MenuType";
import MegaMenu from "./menu/MegaMenu";
import axios from "axios";
import { me } from "@/services/user/UserService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Spin } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearWishlist, fetchWishlist } from "@/store/slices/wishlistSlice";
import { fetchCart } from "@/store/slices/cartSlice";
import { setUserId } from "@/store/slices/authSlice";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  MapPin,
  Phone,
  Menu as MenuIcon,
  X,
  ChevronRight,
  ChevronDown,
  LogOut,
  Flame,
  ShoppingBag,
  Sparkles,
  Package,
} from "lucide-react";

const TimeClock = dynamic(() => import("./TimeClock"), { ssr: false });

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  // Scroll detection for enhanced glassmorphic shadow
  const [isScrolled, setIsScrolled] = useState(false);

  // Navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<NavItem | null>(null);

  // Popover states
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const cartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accountTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const megaTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Redux selectors
  const wishlistCount = useAppSelector(
    (s) => s.wishlist.wishlist?.items?.length ?? 0,
  );
  const cart = useAppSelector((s) => s.cart.cart);
  const cartItems = cart?.items ?? [];
  const cartCount = cartItems.length;
  const cartTotalPrice =
    cart?.totalPrice ||
    cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.qty || 1),
      0,
    );

  // User query
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useQuery({
    queryKey: ["user"],
    queryFn: me,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const userId = user?.id;
  const isLoggedIn = !!user && !isUserError;

  // Real-time Cart & Wishlist Sync
  useEffect(() => {
    dispatch(fetchCart());
    if (userId != null) {
      dispatch(setUserId(userId));
      dispatch(fetchWishlist());
    }
  }, [userId, pathname, dispatch]);

  // Window scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll on mobile drawer or search modal
  useEffect(() => {
    if (mobileMenuOpen || searchModalOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileMenuOpen, searchModalOpen]);

  // Auto focus search input when search modal opens
  useEffect(() => {
    if (searchModalOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchModalOpen]);

  // Close MegaMenu whenever route changes
  useEffect(() => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setMegaOpen(false);
    setActiveMega(null);
  }, [pathname]);

  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
      if (accountTimeoutRef.current) clearTimeout(accountTimeoutRef.current);
      if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    };
  }, []);

  // Instant MegaMenu closer
  const closeMegaNow = useCallback(() => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setMegaOpen(false);
    setActiveMega(null);
  }, []);

  // MegaMenu hover handlers
  const handleMegaEnter = useCallback((item: NavItem) => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setActiveMega(item);
    setMegaOpen(true);
  }, []);

  const handleMegaLeave = useCallback(() => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    megaTimeoutRef.current = setTimeout(() => {
      setMegaOpen(false);
      setActiveMega(null);
    }, 100); // Snappy 100ms transition so it closes promptly when mouse leaves
  }, []);

  // Handle Logout
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

  // Handle Search Submission
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setSearchModalOpen(false);
      router.push(`/categories?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
    { label: "Desktop PCs", href: "/categories?type=desktop" },
    { label: "Laptops", href: "/categories?type=laptop" },
    { label: "Monitors", href: "/categories?type=monitor" },
    { label: "PC Parts", href: "/categories?type=custom-build" },
    { label: "All Products", href: "/categories?type=all" },
  ];

  const suggestedTags = [
    { label: "MSI Titan GT", query: "MSI Titan" },
    { label: "RTX 4080", query: "RTX 4080" },
    { label: "Gaming Laptop", query: "Gaming" },
    { label: "Màn hình 240Hz", query: "Monitor" },
    { label: "PC Custom", query: "Custom" },
  ];

  return (
    <>
      {/* ──────────────────────────────────────────────────────────────────────────
          FIXED HEADER CONTAINER
          ────────────────────────────────────────────────────────────────────────── */}
      <header
        className={styles.headerRoot}
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          width: "100%",
          zIndex: 50,
          margin: "0",
          padding: "0",
        }}
      >
        {/* 1. TOP BAR */}
        <div
          className={styles.topbar}
          onMouseEnter={closeMegaNow}
          style={{ margin: "0", padding: "0" }}
        >
          <div
            className="container-global flex items-center justify-between"
            style={{
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingTop: "6px",
              paddingBottom: "6px",
              margin: "0 auto",
            }}
          >
            {/* Left: Store Status & Live Clock */}
            <div
              className="flex items-center gap-3"
              style={{ margin: "0", padding: "0" }}
            >
              <div
                className="flex items-center gap-1.5 text-xs text-slate-300"
                style={{ margin: "0", padding: "0" }}
              >
                <TimeClock />
              </div>
            </div>

            {/* Center: Store Address */}
            <div
              className={styles.addressWrapper}
              style={{ margin: "0", padding: "0 12px" }}
            >
              <MapPin
                className="w-3.5 h-3.5 text-[#0156ff] shrink-0"
                style={{ marginRight: "6px" }}
              />
              <span className="truncate">
                Số 298 đường Cầu Diễn, P. Tây Tựu, Q. Bắc Từ Liêm, Hà Nội
              </span>
            </div>

            {/* Right: Hotline & Socials */}
            <div
              className="flex items-center gap-3"
              style={{ margin: "0", padding: "0" }}
            >
              <a
                href="tel:0986843838"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-blue-400 transition-colors"
                style={{ margin: "0", padding: "0" }}
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  Hotline: <strong className="text-white font-bold">0986.84.3838</strong>
                </span>
              </a>

              <div
                className="hidden sm:flex items-center gap-1.5 border-l border-slate-700/80"
                style={{
                  paddingLeft: "10px",
                  marginLeft: "4px",
                  margin: "0 0 0 4px",
                }}
              >
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialBtn}
                  aria-label="Facebook"
                  style={{ margin: "0", padding: "0" }}
                >
                  <Image
                    src="/icon/fb.png"
                    alt="Facebook"
                    width={14}
                    height={14}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialBtn}
                  aria-label="Instagram"
                  style={{ margin: "0", padding: "0" }}
                >
                  <Image
                    src="/icon/inta.png"
                    alt="Instagram"
                    width={14}
                    height={14}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MAIN NAVBAR & DESKTOP MENU */}
        <div
          className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ""}`}
          style={{ margin: "0", padding: "0" }}
        >
          <div
            className="container-global flex items-center justify-between"
            style={{
              height: "70px",
              paddingLeft: "20px",
              paddingRight: "20px",
              margin: "0 auto",
            }}
          >
            {/* Brand Logo */}
            <Link
              href="/"
              onMouseEnter={closeMegaNow}
              className="flex items-center gap-2 group shrink-0"
              style={{ margin: "0", padding: "4px 0" }}
            >
              <div
                className="relative transition-transform duration-300 group-hover:scale-105"
                style={{ margin: "0", padding: "0" }}
              >
                <Image
                  src="/logo/Logo.svg"
                  alt="Laptop Shop"
                  width={84}
                  height={58}
                  priority
                  className="object-contain"
                />
              </div>
            </Link>

            {/* Desktop Navigation Zone with MegaMenu */}
            <div
              className={styles.navHoverZone}
              onMouseLeave={handleMegaLeave}
              style={{ margin: "0", padding: "0" }}
            >
              <nav
                className={styles.desktopNav}
                style={{
                  gap: "6px",
                  margin: "0",
                  padding: "0",
                }}
              >
                {navItems.map((item, index) => {
                  const hasMega = !!item.children?.length;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));

                  return (
                    <div
                      key={`desktop-nav-${item.label}-${index}`}
                      className="relative flex items-center h-[70px]"
                      onMouseEnter={() => {
                        if (hasMega) {
                          handleMegaEnter(item);
                        } else {
                          closeMegaNow();
                        }
                      }}
                      style={{ margin: "0", padding: "0" }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMegaNow}
                        className={`${styles.navLink} ${
                          isActive ? styles.navLinkActive : ""
                        }`}
                        style={{
                          padding: "8px 14px",
                          margin: "0",
                        }}
                      >
                        <span>{item.label}</span>
                        {hasMega && (
                          <ChevronDown
                            className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                              megaOpen && activeMega?.label === item.label
                                ? "rotate-180 text-[#0156ff]"
                                : ""
                            }`}
                            style={{ marginLeft: "4px" }}
                          />
                        )}
                      </Link>
                    </div>
                  );
                })}

                {/* Special Deal Pill Badge */}
                <Link
                  href="/categories"
                  onMouseEnter={closeMegaNow}
                  onClick={closeMegaNow}
                  className={styles.dealPill}
                  style={{
                    padding: "6px 14px",
                    marginLeft: "8px",
                    margin: "0 0 0 8px",
                  }}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce" style={{ marginRight: "4px" }} />
                  <span>Our Deals</span>
                </Link>
              </nav>

              {/* MegaMenu Dropdown */}
              <MegaMenu
                item={activeMega}
                open={megaOpen}
                onMouseEnter={() => {
                  if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
                  setMegaOpen(true);
                }}
                onMouseLeave={handleMegaLeave}
                onClose={closeMegaNow}
              />
            </div>

            {/* Action Icons (Search, Wishlist, Cart, User, Mobile Hamburger) */}
            <div
              className="flex items-center gap-1.5 sm:gap-2.5"
              onMouseEnter={closeMegaNow}
              style={{ margin: "0", padding: "0" }}
            >
              {/* Search Trigger Button */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className={styles.iconBtn}
                aria-label="Tìm kiếm sản phẩm"
                title="Tìm kiếm (Ctrl+K)"
                style={{ margin: "0", padding: "0" }}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link Button */}
              <Link
                href="/wishlist"
                className={styles.iconBtn}
                aria-label="Danh sách yêu thích"
                title="Danh sách yêu thích"
                style={{ margin: "0", padding: "0" }}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className={styles.badge}>{wishlistCount}</span>
                )}
              </Link>

              {/* Cart with Interactive Popover & Real-Time Sync */}
              <div
                className="relative"
                onMouseEnter={() => {
                  if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
                  dispatch(fetchCart()); // Fetch latest cart data immediately on hover
                  setCartPreviewOpen(true);
                }}
                onMouseLeave={() => {
                  cartTimeoutRef.current = setTimeout(() => {
                    setCartPreviewOpen(false);
                  }, 250);
                }}
                style={{ margin: "0", padding: "0" }}
              >
                <Link
                  href="/cart"
                  className={styles.iconBtn}
                  aria-label="Giỏ hàng"
                  style={{ margin: "0", padding: "0" }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className={styles.badge}>{cartCount}</span>
                  )}
                </Link>

                {/* Mini Cart Popover Preview */}
                <div
                  className={`${styles.popoverMenu} transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    cartPreviewOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                  style={{
                    width: "320px",
                    right: "0",
                    paddingTop: "8px",
                    margin: "0",
                  }}
                >
                  <div
                    className={styles.popoverCard}
                    style={{
                      padding: "16px",
                      margin: "0",
                    }}
                  >
                    <div
                      className="flex items-center justify-between border-b border-slate-100"
                      style={{
                        paddingBottom: "10px",
                        marginBottom: "12px",
                        margin: "0 0 12px 0",
                      }}
                    >
                      <div
                        className="flex items-center gap-1.5"
                        style={{ margin: "0", padding: "0" }}
                      >
                        <ShoppingBag className="w-4 h-4 text-[#0156ff]" />
                        <span className="font-bold text-sm text-slate-800">
                          Giỏ hàng của bạn
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-semibold">
                        {cartCount} sản phẩm
                      </span>
                    </div>

                    {cartItems.length > 0 ? (
                      <>
                        <div
                          className="max-h-[220px] overflow-y-auto flex flex-col gap-3"
                          style={{ margin: "0", padding: "0" }}
                        >
                          {cartItems.slice(0, 3).map((item, idx) => (
                            <div
                              key={`cart-item-${item.productId}-${idx}`}
                              className="flex items-center gap-3 border-b border-slate-50 last:border-0"
                              style={{
                                paddingBottom: "8px",
                                margin: "0",
                              }}
                            >
                              <div
                                className="relative w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 shrink-0 overflow-hidden"
                                style={{ margin: "0", padding: "0" }}
                              >
                                <Image
                                  src={item.avatar || "/icon/Ellipse.png"}
                                  alt={item.productName}
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className="text-xs font-semibold text-slate-800 truncate"
                                  style={{ margin: "0 0 2px 0", padding: "0" }}
                                >
                                  {item.productName}
                                </p>
                                <p
                                  className="text-xs text-slate-500 font-medium"
                                  style={{ margin: "0", padding: "0" }}
                                >
                                  {item.qty} x{" "}
                                  <span className="text-[#0156ff] font-bold">
                                    {new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(item.price)}
                                  </span>
                                </p>
                              </div>
                            </div>
                          ))}
                          {cartItems.length > 3 && (
                            <p
                              className="text-[11px] text-center text-slate-400 font-medium italic"
                              style={{ margin: "4px 0", padding: "0" }}
                            >
                              và còn {cartItems.length - 3} sản phẩm khác...
                            </p>
                          )}
                        </div>

                        {/* Total and Checkout CTA */}
                        <div
                          className="border-t border-slate-100"
                          style={{
                            marginTop: "12px",
                            paddingTop: "12px",
                            margin: "12px 0 0 0",
                          }}
                        >
                          <div
                            className="flex items-center justify-between text-xs text-slate-600 font-medium"
                            style={{
                              marginBottom: "12px",
                              margin: "0 0 12px 0",
                              padding: "0",
                            }}
                          >
                            <span>Tổng tạm tính:</span>
                            <span className="text-sm font-bold text-slate-900">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(cartTotalPrice)}
                            </span>
                          </div>

                          <div
                            className="grid grid-cols-2 gap-2"
                            style={{ margin: "0", padding: "0" }}
                          >
                            <Link
                              href="/cart"
                              onClick={() => setCartPreviewOpen(false)}
                              className="flex items-center justify-center rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                              style={{ padding: "9px 12px", margin: "0" }}
                            >
                              Xem giỏ hàng
                            </Link>
                            <Link
                              href="/checkout"
                              onClick={() => setCartPreviewOpen(false)}
                              className="flex items-center justify-center rounded-xl text-xs font-bold text-white bg-[#0156ff] hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
                              style={{ padding: "9px 12px", margin: "0" }}
                            >
                              Thanh toán
                            </Link>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center text-center"
                        style={{ padding: "20px 0", margin: "0" }}
                      >
                        <ShoppingCart className="w-8 h-8 text-slate-300" style={{ marginBottom: "8px" }} />
                        <p
                          className="text-xs font-medium text-slate-500"
                          style={{ margin: "0 0 8px 0", padding: "0" }}
                        >
                          Giỏ hàng của bạn đang trống
                        </p>
                        <Link
                          href="/categories"
                          onClick={() => setCartPreviewOpen(false)}
                          className="text-xs font-bold text-[#0156ff] hover:underline"
                          style={{ margin: "0", padding: "0" }}
                        >
                          Khám phá sản phẩm ngay →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* User Account Popover */}
              <div
                className="relative"
                onMouseEnter={() => {
                  if (accountTimeoutRef.current) clearTimeout(accountTimeoutRef.current);
                  setAccountOpen(true);
                }}
                onMouseLeave={() => {
                  accountTimeoutRef.current = setTimeout(() => {
                    setAccountOpen(false);
                  }, 250);
                }}
                style={{ margin: "0", padding: "0" }}
              >
                <Link
                  href={isLoggedIn ? "/profile" : "/signin"}
                  className="relative inline-flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 focus:outline-none"
                  style={{
                    padding: "2px",
                    margin: "0",
                  }}
                >
                  <div
                    className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-2 ring-transparent hover:ring-[#0156ff]/40 overflow-hidden transition-all duration-300"
                    style={{ margin: "0", padding: "0" }}
                  >
                    <Image
                      src={user?.avatar || "/icon/Ellipse.png"}
                      alt="User"
                      fill
                      className="object-cover"
                    />
                  </div>
                  {isLoggedIn && (
                    <span
                      className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"
                      style={{ margin: "0", padding: "0" }}
                    />
                  )}
                </Link>

                {/* Account Dropdown */}
                <div
                  className={`${styles.popoverMenu} transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    accountOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                  style={{
                    width: "250px",
                    right: "0",
                    paddingTop: "8px",
                    margin: "0",
                  }}
                >
                  <div
                    className={styles.popoverCard}
                    style={{
                      padding: "10px",
                      margin: "0",
                    }}
                  >
                    {isUserLoading ? (
                      <div
                        className="flex justify-center items-center"
                        style={{ padding: "20px 0", margin: "0" }}
                      >
                        <Spin size="small" />
                      </div>
                    ) : isLoggedIn ? (
                      <div>
                        {/* User Profile Snippet */}
                        <div
                          className="flex items-center gap-3 border-b border-slate-100"
                          style={{
                            padding: "8px 10px 12px 10px",
                            marginBottom: "6px",
                            margin: "0 0 6px 0",
                          }}
                        >
                          <div
                            className="relative w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200"
                            style={{ margin: "0", padding: "0" }}
                          >
                            <Image
                              src={user?.avatar || "/icon/Ellipse.png"}
                              alt={user?.fullName || "User"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs font-bold text-slate-900 truncate"
                              style={{ margin: "0", padding: "0" }}
                            >
                              {user?.fullName || user?.username || "Thành viên"}
                            </p>
                            <p
                              className="text-[11px] text-slate-400 truncate"
                              style={{ margin: "0", padding: "0" }}
                            >
                              {user?.email || "user@laptopshop.com"}
                            </p>
                          </div>
                        </div>

                        {/* Quick Navigation */}
                        <div
                          className="flex flex-col gap-0.5"
                          style={{ margin: "0", padding: "0" }}
                        >
                          <Link
                            href="/profile"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0156ff] transition-colors"
                            style={{ padding: "9px 12px", margin: "0" }}
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            <span>Thông tin tài khoản</span>
                          </Link>

                          <Link
                            href="/wishlist"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center justify-between rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0156ff] transition-colors"
                            style={{ padding: "9px 12px", margin: "0" }}
                          >
                            <div className="flex items-center gap-2.5">
                              <Heart className="w-4 h-4 text-slate-400" />
                              <span>Danh sách yêu thích</span>
                            </div>
                            <span
                              className="text-[10px] font-bold bg-blue-50 text-[#0156ff] rounded-full"
                              style={{ padding: "2px 7px", margin: "0" }}
                            >
                              {wishlistCount}
                            </span>
                          </Link>

                          <Link
                            href="/profile"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0156ff] transition-colors"
                            style={{ padding: "9px 12px", margin: "0" }}
                          >
                            <Package className="w-4 h-4 text-slate-400" />
                            <span>Đơn hàng của tôi</span>
                          </Link>
                        </div>

                        {/* Logout Action */}
                        <div
                          className="border-t border-slate-100"
                          style={{
                            marginTop: "6px",
                            paddingTop: "6px",
                            margin: "6px 0 0 0",
                          }}
                        >
                          <button
                            type="button"
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            className="w-full flex items-center gap-2.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50/70 transition-colors disabled:opacity-60 cursor-pointer"
                            style={{
                              padding: "9px 12px",
                              margin: "0",
                              border: "none",
                              background: "transparent",
                            }}
                          >
                            <LogOut className="w-4 h-4" />
                            <span>
                              {isSigningOut ? "Đang đăng xuất..." : "Đăng xuất"}
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col gap-2"
                        style={{ padding: "6px", margin: "0" }}
                      >
                        <p
                          className="text-xs text-slate-500 font-medium text-center"
                          style={{ margin: "4px 0 8px 0", padding: "0" }}
                        >
                          Chào mừng bạn đến với LaptopShop
                        </p>

                        <Link
                          href="/signin"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center justify-center rounded-xl text-xs font-bold text-white bg-[#0156ff] hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
                          style={{ padding: "10px 14px", margin: "0" }}
                        >
                          Đăng nhập
                        </Link>

                        <Link
                          href="/signup"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center justify-center rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                          style={{ padding: "9px 14px", margin: "0" }}
                        >
                          Đăng ký tài khoản
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Hamburger Menu Button */}
              <button
                type="button"
                className={`${styles.iconBtn} ${styles.hamburgerBtn}`}
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Mở Menu di động"
                style={{ margin: "0", padding: "0" }}
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. SEARCH MODAL OVERLAY */}
        {searchModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center"
            style={{ margin: "0", padding: "0" }}
          >
            {/* Backdrop Blur */}
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
              onClick={() => setSearchModalOpen(false)}
              style={{ margin: "0", padding: "0" }}
            />

            {/* Search Box */}
            <div
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
              style={{
                marginTop: "80px",
                marginLeft: "16px",
                marginRight: "16px",
                padding: "0",
                margin: "80px 16px 0 16px",
              }}
            >
              <form onSubmit={handleSearchSubmit} style={{ margin: "0", padding: "0" }}>
                <div
                  className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50"
                  style={{
                    padding: "16px 20px",
                    margin: "0",
                  }}
                >
                  <Search className="w-5 h-5 text-[#0156ff] shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm laptop gaming, linh kiện, màn hình..."
                    className="flex-1 bg-transparent text-sm md:text-base text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none"
                    style={{ margin: "0", padding: "0" }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                      style={{ margin: "0", padding: "4px" }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSearchModalOpen(false)}
                    className="text-xs font-semibold text-slate-500 bg-slate-200/70 hover:bg-slate-200 rounded-lg transition-colors"
                    style={{
                      padding: "6px 12px",
                      margin: "0",
                      border: "none",
                    }}
                  >
                    ESC
                  </button>
                </div>
              </form>

              {/* Suggested Searches */}
              <div
                style={{
                  padding: "18px 20px",
                  margin: "0",
                }}
              >
                <div
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400"
                  style={{
                    marginBottom: "12px",
                    margin: "0 0 12px 0",
                    padding: "0",
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0156ff]" />
                  <span>Gợi ý tìm kiếm phổ biến</span>
                </div>

                <div
                  className="flex flex-wrap gap-2"
                  style={{ margin: "0", padding: "0" }}
                >
                  {suggestedTags.map((tag, idx) => (
                    <button
                      key={`suggested-tag-${tag.query}-${idx}`}
                      type="button"
                      onClick={() => {
                        setSearchModalOpen(false);
                        router.push(`/categories?search=${encodeURIComponent(tag.query)}`);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-[#0156ff] rounded-full transition-all duration-200 cursor-pointer"
                      style={{
                        padding: "8px 14px",
                        margin: "0",
                        border: "none",
                      }}
                    >
                      <span>{tag.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. MOBILE DRAWER NAVIGATION */}
        <div
          className={`${styles.mobileOverlay} ${
            mobileMenuOpen ? styles.mobileOverlayActive : ""
          }`}
          onClick={() => setMobileMenuOpen(false)}
          style={{ margin: "0", padding: "0" }}
        />

        <div
          className={`${styles.mobileDrawer} ${
            mobileMenuOpen ? styles.mobileDrawerActive : ""
          }`}
          role="dialog"
          aria-modal="true"
          style={{ margin: "0", padding: "0" }}
        >
          {/* Drawer Header */}
          <div
            className={styles.drawerHeader}
            style={{
              padding: "16px 20px",
              margin: "0",
            }}
          >
            <div className="flex items-center gap-2">
              <Image
                src="/logo/Logo.svg"
                alt="Logo"
                width={70}
                height={46}
                className="object-contain"
              />
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Đóng menu"
              style={{ margin: "0", padding: "8px" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Content */}
          <div
            className="flex-1 overflow-y-auto flex flex-col justify-between"
            style={{
              padding: "16px 20px",
              margin: "0",
            }}
          >
            <div>
              {/* User Greeting Box */}
              <div
                className="rounded-2xl bg-slate-50 border border-slate-100/80 flex items-center gap-3"
                style={{
                  padding: "14px 16px",
                  marginBottom: "16px",
                  margin: "0 0 16px 0",
                }}
              >
                <div
                  className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200"
                  style={{ margin: "0", padding: "0" }}
                >
                  <Image
                    src={user?.avatar || "/icon/Ellipse.png"}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-bold text-slate-800 truncate"
                    style={{ margin: "0", padding: "0" }}
                  >
                    {isLoggedIn
                      ? user?.fullName || user?.username || "Thành viên"
                      : "Khách hàng"}
                  </p>
                  <Link
                    href={isLoggedIn ? "/profile" : "/signin"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[11px] font-semibold text-[#0156ff] hover:underline"
                    style={{ margin: "0", padding: "0" }}
                  >
                    {isLoggedIn ? "Quản lý tài khoản →" : "Đăng nhập / Đăng ký →"}
                  </Link>
                </div>
              </div>

              {/* Main Navigation Links */}
              <nav
                className="flex flex-col gap-1"
                style={{ margin: "0", padding: "0" }}
              >
                {/* MSI Products Expandable Group */}
                <div style={{ margin: "0", padding: "0" }}>
                  <button
                    type="button"
                    onClick={() => setMobileAccordionOpen(!mobileAccordionOpen)}
                    className={`${styles.drawerItem} ${
                      mobileAccordionOpen ? "bg-slate-50 text-[#0156ff]" : ""
                    }`}
                    style={{
                      padding: "12px 14px",
                      margin: "0",
                    }}
                  >
                    <span className="font-bold">MSI Products</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileAccordionOpen ? "rotate-180 text-[#0156ff]" : "text-slate-400"
                      }`}
                    />
                  </button>

                  {mobileAccordionOpen && (
                    <div
                      className="flex flex-col gap-1 border-l-2 border-blue-200"
                      style={{
                        marginLeft: "18px",
                        paddingLeft: "10px",
                        paddingTop: "6px",
                        paddingBottom: "6px",
                        margin: "0 0 0 18px",
                      }}
                    >
                      {navItems[0].children?.map((sub, subIdx) => (
                        <Link
                          key={`drawer-sub-${sub.label}-${subIdx}`}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-xs font-semibold text-slate-600 hover:text-[#0156ff] rounded-lg transition-colors"
                          style={{ padding: "8px 12px", margin: "0" }}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Remaining Nav Items */}
                {navItems.slice(1).map((item, idx) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={`drawer-nav-${item.label}-${idx}`}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`${styles.drawerItem} ${
                        isActive ? styles.drawerItemActive : ""
                      }`}
                      style={{
                        padding: "12px 14px",
                        margin: "0",
                      }}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </Link>
                  );
                })}

                {/* Special Deal link */}
                <Link
                  href="/categories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl font-bold text-sm text-[#0156ff] bg-blue-50/70 border border-blue-100"
                  style={{
                    padding: "12px 14px",
                    marginTop: "8px",
                    margin: "8px 0 0 0",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>Our Deals & Khuyến Mãi</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </nav>
            </div>

            {/* Drawer Footer & Contact Info */}
            <div
              className="border-t border-slate-100"
              style={{
                marginTop: "20px",
                paddingTop: "16px",
                margin: "20px 0 0 0",
              }}
            >
              <div
                className="flex flex-col gap-2 text-xs text-slate-500"
                style={{ margin: "0", padding: "0" }}
              >
                <a
                  href="tel:0986843838"
                  className="flex items-center gap-2 font-bold text-slate-800"
                  style={{ margin: "0", padding: "0" }}
                >
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span>Hotline: 0986.84.3838</span>
                </a>
                <div
                  className="flex items-start gap-2"
                  style={{ margin: "0", padding: "0" }}
                >
                  <MapPin className="w-4 h-4 text-[#0156ff] shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">
                    298 Cầu Diễn, Tây Tựu, Bắc Từ Liêm, Hà Nội
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────────
          MEGAMENU BACKDROP OVERLAY (Closes MegaMenu instantly on mouse leave/click)
          ────────────────────────────────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 bg-slate-900/15 backdrop-blur-[2px] z-30 transition-opacity duration-200 ${
          megaOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onMouseEnter={closeMegaNow}
        onClick={closeMegaNow}
        style={{
          top: "110px",
          margin: "0",
          padding: "0",
        }}
      />

      {/* ──────────────────────────────────────────────────────────────────────────
          HEADER SPACER (Preserves natural page layout flow when header is fixed)
          ────────────────────────────────────────────────────────────────────────── */}
      <div
        className={styles.headerSpacer}
        style={{ margin: "0", padding: "0" }}
      />
    </>
  );
};

export default Header;
