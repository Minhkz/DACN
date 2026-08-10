# Header and Product UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Header and Product components to use an Airy & Minimalist aesthetic with Tailwind utility classes, fluid spacing, and responsive layouts.

**Architecture:** Tailwind-first styling. We will remove fixed inline sizes and margin/padding styles from React components and replace them with responsive Tailwind utility classes (`sm:`, `lg:`). We will replace custom CSS margins in CSS modules with tailwind classes where applicable.

**Tech Stack:** Next.js (App Router), React, Tailwind CSS, CSS Modules.

## Global Constraints

- Avoid inline style objects (`style={{ ... }}`) for margins, paddings, and widths.
- Use `max-w-7xl` for container maximum widths.
- Use fluid padding scales (`px-4 sm:px-6 lg:px-8`).
- Ensure no horizontal scrollbars on mobile.

---

### Task 1: Refactor Header Layout & Topbar

**Files:**
- Modify: `component/Header/Header.tsx`
- Modify: `component/Header/Header.module.css`

**Interfaces:**
- Consumes: Existing Next.js `Link` and standard React state.
- Produces: A responsive topbar and sticky navbar container.

- [ ] **Step 1: Update Header CSS Module**

```css
/* component/Header/Header.module.css */
/* Remove fixed height from .topbar and padding overrides from .navbar, let Tailwind handle spacing */
.topbar {
  background: #020202;
  color: #fff;
  /* removed fixed height */
}

.address {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* removed max-width, handle in tailwind */
}

/* Tablet: ẩn address cho gọn */
@media (max-width: 1023.98px) {
  .address {
    display: none;
  }
}

/* Mobile: topbar xuống 2 dòng */
@media (max-width: 639.98px) {
  .topbarInner {
    flex-wrap: wrap;
    gap: 6px;
  }

  .time {
    order: 1;
    width: 100%; /* Changed from 50% for better mobile wrap */
  }

  .contact {
    order: 2;
    width: 100%; /* Changed from 50% for better mobile wrap */
    justify-content: space-between;
  }
}

/* ===== NAV ===== */
.navbar {
  /* removed border and background, moved to tailwind */
}
```

- [ ] **Step 2: Apply sticky glassmorphism and topbar Tailwind styles to Header.tsx**

```tsx
// In component/Header/Header.tsx
// Update the top container:
<header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-slate-100/80 shadow-sm transition-all">
  <div className={`py-2 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-300 text-xs ${styles.topbar}`}>
    <div className={`max-w-7xl mx-auto flex justify-between items-center ${styles.topbarInner}`}>
      <div className={styles.time}>
        <TimeClock />
      </div>
      <div className={`flex-1 truncate mx-4 text-center ${styles.address}`}>
        Address: 110 Tran Phu, Ha Dong, Ha Noi
      </div>
      <div className={`flex items-center gap-3 ${styles.contact}`}>
        <span className="flex items-center gap-1">
          <Image src="/icon/phone-call.png" alt="phone" width={14} height={14} />
          Hotline: 0888.888.888
        </span>
      </div>
    </div>
  </div>
```

- [ ] **Step 3: Apply fluid padding to Main Navigation Bar**

```tsx
// In component/Header/Header.tsx
// Update the navbar container:
  <div className={styles.navbar}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-5 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo/laptop_logo.png" alt="logo" width={32} height={32} />
        <span className="font-extrabold text-xl tracking-tight text-slate-900 hidden sm:block">LaptopShop</span>
      </Link>
// ... ensure links use text-slate-600 hover:text-slate-900 font-medium
```

- [ ] **Step 4: Verify visually (Dev server check)**

Run: `npm run dev` and open localhost.
Expected: Header should stick to the top with a frosted glass effect, topbar should pad nicely.

- [ ] **Step 5: Commit**

```bash
git add component/Header/Header.tsx component/Header/Header.module.css
git commit -m "style: refactor Header to use Tailwind fluid spacing and glassmorphism"
```

---

### Task 2: Refactor CardProduct Dimensions and Layout

**Files:**
- Modify: `component/Product/CardProduct/CardProduct.tsx`

**Interfaces:**
- Consumes: `ProductDetailDto`

- [ ] **Step 1: Refactor outer card container**

```tsx
// component/Product/CardProduct/CardProduct.tsx
// Replace fixed w-[234px] and heavy hover shadows
      <div
        onClick={() => setOpenDetail(true)}
        className="
          group relative w-full max-w-[260px] mx-auto cursor-pointer overflow-hidden rounded-2xl
          bg-white border border-slate-100/90 p-4 sm:p-5 shadow-sm
          transition-all duration-300 ease-out
          hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-100
        "
      >
        <div className="relative flex flex-col h-full">
          {/* Removed style object with fixed paddings */}
```

- [ ] **Step 2: Refactor image framing**

```tsx
// component/Product/CardProduct/CardProduct.tsx
// Wrap image in a nice box
          <div className="relative bg-slate-50/50 rounded-xl p-3 h-[180px] flex items-center justify-center overflow-hidden mb-4">
             {/* Stock status overlay absolute positioned inside */}
             <div className="absolute top-2 left-2 z-10">
                {isAvailable ? (
                   <Image src="/img/stock.png" alt="stock" width={60} height={22} className="w-auto h-5" />
                ) : (
                   <Image src="/img/check.png" alt="out of stock" width={60} height={22} className="w-auto h-5" />
                )}
             </div>

             <Image
                src={productImage}
                alt="Product image"
                fill
                className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out z-0"
              />
          </div>
```

- [ ] **Step 3: Refactor Typography and Price Block**

```tsx
// component/Product/CardProduct/CardProduct.tsx
// Remove inline styles for mb and use Tailwind spacing
          {/* Info */}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-slate-800 transition-colors duration-300 group-hover:text-blue-600 mb-2">
                {product.name}
              </h3>

              {/* Price display with discount badge */}
              <div className="flex flex-col gap-0.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 line-through">
                    {formatPrice(product.price * 1.2)}
                  </span>
                  <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    -20%
                  </span>
                </div>
                <div className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                  {formatPrice(product.price)}
                </div>
              </div>
            </div>
```

- [ ] **Step 4: Refactor Actions (Wishlist/Compare & Add to Cart)**

```tsx
// component/Product/CardProduct/CardProduct.tsx
// Update Wishlist/Compare Floating Action Buttons
          <div
            className="
              absolute top-3 right-3 z-20 flex flex-col gap-2
              opacity-0 scale-90 pointer-events-none
              transition-all duration-300 ease-out
              group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
            "
          >
            {/* Heart Button */}
            <div
              onClick={handleLike}
              className={`
                flex h-8 w-8 items-center justify-center rounded-full
                border border-slate-100 bg-white/90 shadow-md backdrop-blur-sm
                transition-all duration-300 cursor-pointer
                hover:scale-110 active:scale-95
                ${isWishlistPending ? "opacity-40 cursor-not-allowed scale-90" : ""}
                ${
                  isLiked && !isWishlistPending
                    ? "bg-gradient-to-br from-rose-500 to-red-600 border-none shadow-[0_6px_14px_rgba(244,63,94,0.35)] scale-110"
                    : ""
                }
              `}
            >
              {/* ... Image icon ... */}
            </div>
// ... repeat similar h-8 w-8 for compare button

// Update Add to Cart Button
            <button
              type="button"
              disabled={isCartPending || !isAvailable || isInCart}
              onClick={isAvailable ? handleAddToCart : undefined}
              className={`
                w-full py-2.5 mt-auto rounded-full text-xs font-bold tracking-wide
                transition-all duration-300 flex items-center justify-center gap-2
                ${
                  isInCart
                    ? "bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)] cursor-default"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-md"
                }
                ${
                  isCartPending || !isAvailable
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none opacity-80"
                    : ""
                }
              `}
            >
```

- [ ] **Step 5: Verify visually (Dev server check)**

Run: `npm run dev` and open localhost. 
Expected: Product cards should have uniform height, responsive width, elegant padding, and smooth hover effects.

- [ ] **Step 6: Commit**

```bash
git add component/Product/CardProduct/CardProduct.tsx
git commit -m "style: refactor CardProduct UI to minimal airy aesthetic"
```

---

### Task 3: Refactor Product Containers Layout Spacing

**Files:**
- Modify: `component/Product/MainProduct/MainProduct.tsx`
- Modify: `component/Product/MainProduct/SeriesProduct.tsx`
- Modify: `component/Product/NewProduct/NewProduct.tsx`

**Interfaces:**
- Consumes: The newly styled `CardProduct` component.

- [ ] **Step 1: Refactor MainProduct spacing**

```tsx
// component/Product/MainProduct/MainProduct.tsx
// Remove inline styles, use Tailwind vertical spacing (space-y-12)
const MainProduct = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10 lg:space-y-14 flex flex-col">
      <SeriesProduct banner={{ src: "/product/banner/custom_build.png", title: "Custom Builds" }} type="custom-build" />
      <div className="border-b border-slate-100/50" />
      <SeriesProduct banner={{ src: "/product/banner/msi_laptop.png", title: "MSI Laptops" }} series={["MSI GS Series", "MSI GT Series", "MSI GL Series", "MSI GE Series"]} type="laptop" />
      <div className="border-b border-slate-100/50" />
      <SeriesProduct banner={{ src: "/product/banner/msi_desktop.png", title: "MSI Desktops" }} series={["MSI Infinite Series", "MSI Trident", "MSI GL Series", "MSI Nightblade"]} type="desktop" />
      <div className="border-b border-slate-100/50" />
      <SeriesProduct banner={{ src: "/product/banner/msi_monitors.png", title: "MSI Monitors" }} type="monitor" />
    </div>
  );
};
```

- [ ] **Step 2: Refactor SeriesProduct container spacing**

```tsx
// component/Product/MainProduct/SeriesProduct.tsx
// Remove style={{ marginBottom: "36px" }} etc.
  return (
    <section className="w-full">
      {/* ===== SERIES TABS ===== */}
      {props.series && (
        <div className="flex overflow-x-auto whitespace-nowrap gap-4 sm:gap-6 pb-2 mb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
// ...
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
// ...
        {/* ===== PRODUCTS HORIZONTAL SCROLL ===== */}
        <div className="min-w-0 flex-1">
          {isLoading ? (
            <div className="flex h-[360px] items-center justify-center bg-slate-50/40 border border-slate-100/80 rounded-2xl">
              <Spin size="large" />
            </div>
          ) : products.length > 0 ? (
            <div className="flex overflow-x-auto overflow-y-hidden scroll-smooth gap-4 sm:gap-6 pb-6 pt-2 px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {products.map((product) => (
                <div key={product.id} className="shrink-0 w-[240px] sm:w-[260px]">
                  <CardProduct product={product} />
                </div>
              ))}
            </div>
```

- [ ] **Step 3: Refactor NewProduct container padding and header**

```tsx
// component/Product/NewProduct/NewProduct.tsx
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Sản phẩm mới
        </h2>
// ...
// Carousel wrappers
            {products.map((product) => (
              <div key={product.id} className="px-2 py-4"> {/* Padding ensures hover shadows aren't clipped */}
                <CardProduct product={product} />
              </div>
            ))}
// ...
      {/* Zip banner */}
      <div className="flex items-center justify-center flex-wrap gap-4 rounded-2xl bg-slate-50/80 border border-slate-100/50 px-6 py-4 mt-8 min-h-[72px]">
```

- [ ] **Step 4: Verify visually (Dev server check)**

Run: `npm run dev` and open localhost.
Expected: Consistent rhythm between sections, grid layouts adapting well to screen width, shadows on product cards not getting clipped by `overflow-hidden` containers.

- [ ] **Step 5: Commit**

```bash
git add component/Product/MainProduct/MainProduct.tsx component/Product/MainProduct/SeriesProduct.tsx component/Product/NewProduct/NewProduct.tsx
git commit -m "style: refactor product container spacing and responsive layouts"
```
