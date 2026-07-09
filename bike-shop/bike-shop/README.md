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
   - 5 bài viết, 5 liên hệ, vài thông báo mẫu

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
- Trang chủ với banner slider, sản phẩm nổi bật, xe bán chạy, xe mới về, feedback khách hàng, bài viết mới nhất
- Danh sách sản phẩm (tìm kiếm/lọc theo danh mục, hãng, giá, sắp xếp)
- Chi tiết sản phẩm, đánh giá & bình luận có kèm ảnh — **chỉ khách hàng đã mua và nhận sản phẩm thành công (đơn hàng COMPLETED) mới được đánh giá**, mỗi người chỉ đánh giá 1 lần/sản phẩm, có thể thích (like) đánh giá của người khác
- **Sản phẩm yêu thích**: lưu/bỏ lưu ngay trên ProductCard hoặc trang chi tiết, xem danh sách tại `/favorites`
- **Bài viết & Tin tức**: xem danh sách và chi tiết bài viết tại `/posts`
- **Trang Liên hệ**: gửi lời nhắn cho shop tại `/contact`
- **Chatbot AI hỗ trợ**: khung chat nổi ở góc màn hình, trả lời dựa trên dữ liệu sản phẩm/danh mục/hãng thật trong database, có gợi ý sản phẩm kèm link
- **Thông báo**: chuông thông báo trên header, tự động nhận thông báo khi đặt hàng / đổi trạng thái đơn / hủy đơn
- Giỏ hàng, đặt hàng, chọn phương thức thanh toán
- Lịch sử đơn hàng, hủy đơn (khi còn PENDING), có nút "Đánh giá" dẫn thẳng tới sản phẩm khi đơn đã hoàn thành

**Quản trị (ADMIN/STAFF):**
- Dashboard: doanh thu, số đơn hàng, số sản phẩm, số khách hàng, **sản phẩm bán chạy**, **khách hàng mới trong tháng**
- CRUD sản phẩm, danh mục, hãng xe — **ảnh sản phẩm/logo hãng được tải lên trực tiếp từ máy tính** (không nhập link URL), lưu vào thư mục `backend/uploads/` và phục vụ qua `/uploads/**`
- Quản lý đơn hàng (duyệt / đổi trạng thái: PENDING → CONFIRMED → SHIPPING → COMPLETED / CANCELLED)
- **Quản lý đánh giá**: xem toàn bộ đánh giá, trả lời (reply) đánh giá của khách, xóa đánh giá vi phạm
- **Quản lý bài viết**: thêm/sửa/xóa, ẩn/hiện bài viết, upload ảnh đại diện, tự sinh slug từ tiêu đề
- **Quản lý liên hệ**: xem danh sách, đánh dấu đã xử lý, xóa
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
| GET/POST/DELETE | `/reviews/product/{id}` | Đánh giá sản phẩm (kèm ảnh, like, phản hồi shop) |
| GET | `/reviews/product/{id}/can-review` | Kiểm tra người dùng hiện tại có đủ điều kiện đánh giá không |
| POST | `/reviews/{id}/like` | Thích/bỏ thích một đánh giá |
| PUT | `/reviews/{id}/reply` (ADMIN) | Trả lời đánh giá của khách hàng |
| GET | `/reviews/latest` | Đánh giá nổi bật cho trang chủ (feedback khách hàng) |
| GET | `/reviews/admin/all` (ADMIN) | Toàn bộ đánh giá để quản lý |
| POST | `/upload/image` (ADMIN, multipart/form-data, field `file`) | Tải ảnh lên, trả về `{ "url": "/uploads/xxxx.jpg" }` |
| GET | `/posts` | Danh sách bài viết đã xuất bản |
| GET | `/posts/slug/{slug}` | Chi tiết bài viết |
| GET/POST/PUT/PATCH/DELETE | `/posts/**` (ADMIN cho ghi) | Quản lý bài viết, ẩn/hiện |
| POST | `/contact` | Gửi liên hệ (không cần đăng nhập) |
| GET/PUT/DELETE | `/contact/**` (ADMIN) | Quản lý liên hệ |
| POST | `/chat` | Gửi câu hỏi cho chatbot AI |
| GET/POST/DELETE | `/favorite`, `/favorite/{productId}` | Sản phẩm yêu thích |
| GET | `/notification`, `/notification/unread-count` | Danh sách & số thông báo chưa đọc |
| PUT | `/notification/read/{id}`, `/notification/read-all` | Đánh dấu đã đọc |
| GET | `/products/best-sellers` | Xe bán chạy (dựa trên đơn hàng COMPLETED) |
| GET | `/admin/dashboard/stats` (ADMIN) | Thống kê tổng quan + sản phẩm bán chạy + khách hàng mới |

> Nếu chạy backend ở địa chỉ khác `http://localhost:8080`, đặt biến môi trường `REACT_APP_API_ORIGIN` khi build/chạy frontend để ảnh upload hiển thị đúng (mặc định lấy `http://localhost:8080`).

## 9. Ghi chú mở rộng

Dự án được thiết kế theo layered architecture (Controller → Service → Repository → Entity, có Mapper & DTO riêng) để dễ mở rộng: thêm thanh toán online (VNPay/MoMo thực tế), upload ảnh, mã giảm giá, wishlist, v.v.
