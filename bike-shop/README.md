# BikeShop – Website Thương mại điện tử bán xe đạp

Hệ thống bán hàng đầy đủ: **Backend (Spring Boot + MySQL + JWT)** và **Frontend (ReactJS + Tailwind + Redux Toolkit)**.

## 1. Cấu trúc dự án

```
bike-shop/
├── backend/     → Spring Boot REST API
└── frontend/    → ReactJS SPA (khách hàng + trang quản trị)
```

## 2. Yêu cầu hệ thống

- JDK 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+ / npm 9+

## 3. Cài đặt & chạy Backend

1. Tạo database MySQL (hoặc để ứng dụng tự tạo nhờ `createDatabaseIfNotExist=true`):
   ```sql
   CREATE DATABASE bike_shop;
   ```
2. Mở `backend/src/main/resources/application.properties` và chỉnh `spring.datasource.username` / `password` cho đúng với MySQL của bạn.
3. Chạy ứng dụng:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
4. Backend chạy tại: `http://localhost:8080`
5. Lần chạy đầu tiên, `DataInitializer` sẽ tự động seed dữ liệu mẫu:
   - **Admin:** `admin / admin123`
   - **Khách hàng:** `customer1 / 123456`, `customer2 / 123456`
   - 5 danh mục, 5 hãng xe, 10 sản phẩm mẫu

## 4. Cài đặt & chạy Frontend

```bash
cd frontend
npm install
npm start
```

Frontend chạy tại: `http://localhost:3000` và gọi API tới `http://localhost:8080/api` (cấu hình trong `src/services/axiosConfig.js`).

## 5. Tài khoản demo

| Vai trò  | Username    | Password  |
|----------|-------------|-----------|
| ADMIN    | admin       | admin123  |
| CUSTOMER | customer1   | 123456    |
| CUSTOMER | customer2   | 123456    |

## 6. Tính năng chính

**Khách hàng:**
- Trang chủ, danh sách sản phẩm (tìm kiếm/lọc theo danh mục, hãng, giá, sắp xếp)
- Chi tiết sản phẩm, đánh giá & bình luận
- Giỏ hàng, đặt hàng, chọn phương thức thanh toán
- Lịch sử đơn hàng, hủy đơn (khi còn PENDING)

**Quản trị (ADMIN/STAFF):**
- Dashboard: doanh thu, số đơn hàng, số sản phẩm, số khách hàng
- CRUD sản phẩm, danh mục, hãng xe
- Quản lý đơn hàng (duyệt / đổi trạng thái: PENDING → CONFIRMED → SHIPPING → COMPLETED / CANCELLED)
- Quản lý người dùng (sửa thông tin, đổi vai trò, xóa)

## 7. Bảo mật

- Spring Security + JWT (Bearer Token), stateless
- Mật khẩu mã hoá bằng BCrypt
- Phân quyền theo vai trò: `ADMIN`, `STAFF`, `CUSTOMER` (dùng `hasRole` trong `SecurityConfig`)

## 8. API chính (tiền tố `/api`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/auth/register` | Đăng ký |
| POST | `/auth/login` | Đăng nhập, trả JWT |
| GET | `/products` | Danh sách sản phẩm (filter, phân trang) |
| GET/POST/PUT/DELETE | `/products/{id}` | CRUD sản phẩm (ADMIN) |
| GET/POST/PUT/DELETE | `/categories`, `/brands` | CRUD danh mục / hãng xe |
| GET/POST/PUT/DELETE | `/cart`, `/cart/items/{id}` | Giỏ hàng |
| POST/GET/PUT | `/orders` | Đặt hàng, xem đơn, đổi trạng thái |
| GET/POST/DELETE | `/reviews/product/{id}` | Đánh giá sản phẩm |
| GET | `/admin/dashboard/stats` | Thống kê tổng quan (ADMIN) |

## 9. Ghi chú mở rộng

Dự án được thiết kế theo layered architecture (Controller → Service → Repository → Entity, có Mapper & DTO riêng) để dễ mở rộng: thêm thanh toán online (VNPay/MoMo thực tế), upload ảnh, mã giảm giá, wishlist, v.v.
