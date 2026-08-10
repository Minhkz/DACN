# Connect Next.js Frontend to Dockerized Backend Design

## Purpose
Update the Next.js Frontend (FE) configuration so that it correctly points to the newly Dockerized Backend services (specifically, hitting the NGINX reverse proxy on port 8000).

## Architecture
- **Frontend Environment**: Runs locally on the host machine (`npm run dev`).
- **Backend Environment**: Runs in Docker Compose. NGINX exposes port `8000` to the host.
- **Data Flow (Client)**: Browser -> `http://localhost:3000/api/proxy/*` -> Next.js Rewrite -> `http://localhost:8000/api/v1/*` (NGINX) -> `app:8080` (Spring Boot).
- **Data Flow (Server)**: Next.js Server -> Axios Fetch -> `http://localhost:8000/api/v1/*` (NGINX) -> `app:8080` (Spring Boot).

## Changes Required

### 1. Update Environment Variables
- File: `d:\DACN\FE\laptopshop\.env.local`
- Change: Update `NEXT_PUBLIC_API_URL` from `http://localhost:8080/api/v1` to `http://localhost:8000/api/v1`.

### 2. Update Next.js Rewrites
- File: `d:\DACN\FE\laptopshop\next.config.ts`
- Change: Update the proxy destination inside `rewrites()` from `http://localhost:8080/api/v1/:path*` to `http://localhost:8000/api/v1/:path*`.