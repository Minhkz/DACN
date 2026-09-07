# Dự án Đồ án Chuyên ngành (DACN) - E-Commerce Laptop Shop

Hệ thống website thương mại điện tử bán laptop và thiết bị công nghệ toàn diện, bao gồm Trang cửa hàng dành cho khách hàng (Customer Storefront), Trang quản trị (Admin Dashboard) và Hệ thống Backend RESTful API kết hợp AI, Caching và Message Queue.

---

## 🏗 Cấu trúc Thư mục Dự án

```text
.
├── BE/
│   └── DACN/               # Backend Spring Boot (Java 21)
├── FE/
│   ├── laptopshop/         # Frontend Cửa hàng (Next.js 16, React 19, Tailwind CSS)
│   └── Admin/              # Frontend Quản trị (Next.js 16, TailAdmin Template)
├── csdl.sql                # Cơ sở dữ liệu MySQL khởi tạo
└── README.md               # Document hướng dẫn dự án
```

---

## 🚀 Công nghệ Sử dụng (Tech Stack)

### 1. Backend (`BE/DACN`)
- **Ngôn ngữ & Framework**: Java 21, Spring Boot 3.2.5
- **Cơ sở dữ liệu**: MySQL 8.x
- **ORM & Mapping**: Spring Data JPA, Hibernate, MapStruct, Lombok
- **Bảo mật**: Spring Security, JWT (JSON Web Token)
- **Caching & Session**: Redis 7 (Alpine)
- **Message Broker**: Apache Kafka 4.3.0 (Xử lý sự kiện bất đồng bộ)
- **Tích hợp AI**: Spring AI, Ollama (Tích hợp mô hình AI tư vấn/tìm kiếm)
- **Lưu trữ ảnh**: Cloudinary API
- **Containerization & Proxy**: Docker, Docker Compose, Nginx Reverse Proxy

### 2. Frontend Cửa hàng (`FE/laptopshop`)
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Ant Design, Material UI (MUI), Emotion
- **Quản lý trạng thái & Data Fetching**: Redux Toolkit, TanStack React Query (v5), Axios
- **Icon & UI**: Lucide React, Slick Carousel (Slider banner/sản phẩm)

### 3. Frontend Quản trị (`FE/Admin`)
- **Framework**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, TailAdmin Dashboard Template
- **Biểu đồ & Thống kê**: ApexCharts / JSVectorMap

---

## 🛠 Hướng dẫn Cài đặt & Khởi chạy

### 1. Yêu cầu Tiền đề (Prerequisites)
- **Node.js**: `>= 20.x`
- **Java Development Kit (JDK)**: `>= 21`
- **Maven**: `>= 3.8+` (hoặc sử dụng wrapper `mvnw` đi kèm)
- **Docker & Docker Compose** (Bắt buộc cho Redis, Kafka, Ollama, Nginx)
- **MySQL**: `>= 8.0` (Nếu chạy trực tiếp trên máy thay vì Docker)

---

### 2. Cấu hình & Khởi chạy Backend (`BE/DACN`)

#### Bước 2.1: Chuẩn bị Cơ sở dữ liệu MySQL
1. Tạo database tên `laptopshop` trên MySQL local hoặc Docker:
   ```sql
   CREATE DATABASE laptopshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Import dữ liệu ban đầu từ file `csdl.sql` ở thư mục gốc của dự án:
   ```bash
   mysql -u root -p laptopshop < csdl.sql
   ```

#### Bước 2.2: Khởi chạy Hạ tầng Services (Redis, Kafka, Ollama, Nginx) qua Docker
Di chuyển vào thư mục backend:
```bash
cd BE/DACN
```

Khởi chạy các container hỗ trợ bằng Docker Compose:
```bash
docker-compose up -d redis kafka ollama
```

*(Tùy chọn) Chạy toàn bộ Backend + Nginx trong Docker:*
```bash
docker-compose up -d --build
```

#### Bước 2.3: Khởi chạy Backend (Dev Mode)
Nếu muốn chạy Backend trực tiếp từ máy local:
```bash
# Windows Command Prompt / PowerShell
.\mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```
Backend sẽ khởi chạy tại cổng: `http://localhost:8080` (hoặc `http://localhost:8000` thông qua Nginx proxy).

---

### 3. Cấu hình & Khởi chạy Frontend Customer (`FE/laptopshop`)

Di chuyển vào thư mục khách hàng:
```bash
cd FE/laptopshop
```

1. Cài đặt phụ thuộc:
   ```bash
   npm install
   ```

2. Tạo file `.env.local` nếu cần thiết:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

3. Khởi chạy ở chế độ Development:
   ```bash
   npm run dev
   ```
Trang bán hàng sẽ chạy tại: `http://localhost:3000`

---

### 4. Cấu hình & Khởi chạy Frontend Admin (`FE/Admin`)

Di chuyển vào thư mục Admin:
```bash
cd FE/Admin
```

1. Cài đặt phụ thuộc:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Tạo file `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

3. Khởi chạy ở chế độ Development:
   ```bash
   npm run dev
   ```
Trang Admin sẽ chạy tại: `http://localhost:3002` (hoặc port khả dụng tiếp theo).

---

## 🌟 Các Tính năng Chính

### 🛍 Trang Khách hàng (Storefront)
- Xem danh mục sản phẩm, tìm kiếm, lọc sản phẩm theo cấu hình, thương hiệu, mức giá.
- Chi tiết sản phẩm, gallery ảnh, bài đánh giá và nhận xét.
- Giỏ hàng (Cart), Đặt hàng (Checkout) và quản lý đơn hàng cá nhân.
- Đăng nhập/Đăng ký tài khoản (JWT, Cookie Authentication).
- AI Assistant / Chatbot tư vấn sản phẩm sử dụng Ollama & Spring AI.

### 👨‍💼 Trang Quản trị (Admin Panel)
- **Dashboard**: Thống kê doanh thu, đơn hàng mới, biểu đồ tăng trưởng.
- **Quản lý Sản phẩm**: Thêm/Sửa/Xóa laptop, quản lý biến thể, thông số kỹ thuật, tải ảnh lên Cloudinary.
- **Quản lý Đơn hàng**: Cập nhật trạng thái đơn hàng (Đã xác nhận, Đang giao, Hoàn thành, Hủy).
- **Quản lý Người dùng**: Phân quyền (Role-based access control: Admin, User), khóa/mở tài khoản.
- **Quản lý Danh mục & Thương hiệu**: Đổi mới cấu trúc sản phẩm linh hoạt.

---

## 📌 Ghi chú Bảo mật & Môi trường

- Mọi mật khẩu và API Key quan trọng (MySQL root password, Cloudinary API, Secret JWT) nên được cấu hình qua biến môi trường hoặc file `application.yml`/`.env.local`.
- Nginx reverse proxy được cấu hình tại `BE/DACN/nginx.conf` giúp điều phối traffic vào backend service.
