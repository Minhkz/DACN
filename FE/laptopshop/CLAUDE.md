# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a Next.js App Router project bootstrapped with `create-next-app`.

- **Development Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Start Production Server:** `npm run start`
- **Linting:** `npm run lint`

## Code Architecture and Structure

- **App Router (`/app`)**: Contains Next.js routes, pages, and layouts following the App Router paradigm.
- **Components (`/component`)**: Reusable React components categorized by feature (e.g., Cart, Checkout, Header, Profile, Wishlist).
- **State Management (`/store`)**: Uses Redux Toolkit.
  - `store/index.ts` is the main store configuration.
  - `store/slices/` contains Redux slices for feature states like authentication (`authSlice.ts`), cart (`cartSlice.ts`), and wishlist (`wishlistSlice.ts`).
  - Access state using the typed hooks in `store/hooks.ts`.
- **API and Data Fetching (`/services`)**: Contains modularized functions interacting with external APIs (e.g., ProductApi, CartService, OrderService, UserService).
- **Networking/HTTP (`/lib/axios`)**: Uses Axios for HTTP requests.
  - `client.ts`: Configured for client-side API requests (likely handling browser cookies/tokens).
  - `server.ts`: Configured for server-side API requests.
- **Authentication (`/lib/auth`)**: Cookie management and authentication utilities.
- **Styling**: Tailwind CSS is the primary styling solution (configured in `tailwind.config.mjs`), complemented by Material UI and DaisyUI. PostCSS is also configured.
- **Path Aliases**: The `@/*` path alias maps to the root directory, allowing clean imports like `@/component/...` or `@/services/...`.

## Technology Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **State Management**: Redux Toolkit & React-Redux
- **Data Fetching/Caching**: TanStack React Query (`@tanstack/react-query`) & Axios
- **Styling**: Tailwind CSS, Material UI (`@mui/material`), Emotion, Ant Design (`antd`), DaisyUI
- **UI Components/Icons**: Lucide React
- **Date/Time**: Flatpickr
- **Carousels**: React Slick (`react-slick`)