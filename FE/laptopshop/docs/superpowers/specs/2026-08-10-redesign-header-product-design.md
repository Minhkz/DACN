# Design Spec: Header & Product Component UI Redesign (Airy & Minimalist)

**Date:** 2026-08-10  
**Target Components:** `component/Header`, `component/Product` (`CardProduct`, `SeriesProduct`, `NewProduct`)  
**Design Style:** Airy & Minimalist (Apple Store / Modern SaaS inspired)

---

## 1. Overview & Goals
The goal of this redesign is to modernize the UI of the Header and Product components by replacing fixed inline margins/paddings and heavy borders with natural Tailwind spacing, fluid padding/gap scales, clean typography, and responsive grid layouts. 

### Key Principles
1. **Generous Whitespace:** Avoid cramped cards and headers. Use fluid padding scales (`px-4 sm:px-6 lg:px-8`).
2. **Tailwind-First:** Move away from inline `style={{ ... }}` objects and fixed CSS module constraints towards modern Tailwind utility classes.
3. **Subtle Elevation & Interactivity:** Soft shadows (`shadow-sm`, `hover:shadow-xl`), rounded corners (`rounded-2xl`), and micro-interactions (`hover:-translate-y-1`).
4. **Fluid Responsiveness:** Flex and grid containers that adapt cleanly across mobile, tablet, and desktop breakpoints without horizontal overflow.

---

## 2. Header Redesign (`component/Header/Header.tsx`)

### Layout & Responsiveness
- **Sticky Glassmorphism Header:** 
  - Class: `sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-100/80`
  - Ensures a sleek floating appearance when scrolling.
- **Top Announcement / Info Bar:**
  - Dark minimalist background (`bg-slate-950 text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8`).
  - Flex layout with clear separation between business hours, address, and contact info.
  - Automatically truncates address gracefully on smaller screens.
- **Main Navigation Bar:**
  - Dynamic fluid height (`py-4 lg:py-5`) replacing fixed `h-[68px]`.
  - Logo, Desktop Nav Links, and Action Icons aligned with `flex items-center justify-between gap-6`.
  - Mobile Hamburger Menu trigger styled as a soft rounded icon button (`p-2.5 rounded-full hover:bg-slate-100 transition-colors`).
- **MegaMenu & Mobile Drawer:**
  - MegaMenu: Styled with floating popover shadow (`shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-2xl border border-slate-100`).
  - Mobile Drawer: Uses modern slide-over overlay with `p-6` padding, clear typography hierarchy, and pill-shaped action buttons.

---

## 3. Product Component Redesign (`component/Product/*`)

### A. CardProduct (`component/Product/CardProduct/CardProduct.tsx`)
- **Container Structure:**
  - Replaces `w-[234px]` fixed width with fluid `w-full max-w-[260px] mx-auto` to fit grids and sliders cleanly.
  - Border & Shadow: `border border-slate-100/90 rounded-2xl bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-100`.
- **Image Section:**
  - Centered frame with `bg-slate-50/50 rounded-xl p-3 h-[180px] flex items-center justify-center relative overflow-hidden mb-4`.
  - Image hover effect: Smooth scale `group-hover:scale-105 transition-transform duration-500 ease-out`.
  - Action overlay (Wishlist/Compare): Minimalist floating pill buttons (`w-8 h-8 rounded-full bg-white/90 shadow-md backdrop-blur-sm hover:scale-110 transition-transform flex items-center justify-center`).
- **Typography & Details:**
  - Title: `text-sm font-semibold text-slate-800 line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-blue-600 transition-colors mb-2`.
  - Review Ratings: Compact star container with `text-xs text-slate-400 font-medium`.
  - Price Block: 
    - Original price: `text-xs text-slate-400 line-through`.
    - Discount pill: `bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-md`.
    - Main price: `text-lg font-bold text-slate-900 tracking-tight mt-0.5`.
- **Action Button:**
  - Modern full-width rounded pill button: `w-full py-2.5 mt-3 rounded-full text-xs font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2`.
  - State styles:
    - Normal: `bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-none hover:shadow-md`.
    - In Cart: `bg-blue-600 text-white`.
    - Disabled / Out of stock: `bg-slate-100 text-slate-400 cursor-not-allowed`.

### B. Product Containers (`SeriesProduct.tsx`, `NewProduct.tsx`, `MainProduct.tsx`)
- **Spacing:**
  - Remove all raw `style={{ marginTop, marginBottom }}`.
  - Apply clean vertical rhythm: `my-8 sm:my-12 lg:my-16 space-y-8`.
- **Carousel & Grid Adjustments:**
  - Ensure slide paddings in `NewProduct` carousel maintain uniform gap separation without clipping product hover shadows (`px-2 py-4`).
  - Section headers styled with bold minimalist typography (`text-2xl sm:text-3xl font-bold tracking-tight text-slate-900`).

---

## 4. Implementation Steps
1. **Header Component (`Header.tsx`):**
   - Clean up fixed dimensions and inline styling.
   - Refactor Tailwind classes for Sticky Glassmorphism header and Mobile Drawer.
2. **Product Card (`CardProduct.tsx`):**
   - Refactor outer card div to responsive width and padding.
   - Refactor image frame, title typography, price section, and button styles.
3. **Series & New Product Containers (`SeriesProduct.tsx`, `NewProduct.tsx`):**
   - Update container spacing and horizontal scroll/carousel paddings to accommodate shadow hover effects without scroll clipping.

---

## 5. Verification Plan
- **Desktop View:** Verify sticky header blur, desktop menu hover states, card elevation on hover.
- **Mobile View:** Verify mobile header drawer open/close behavior, responsive padding, full-width fluid cards in grid layout.
- **Code Check:** Ensure no lingering fixed inline style margins (`style={{ marginTop: ... }}`) remain in the target files.
