import React from "react";
import { Link } from "react-router-dom";

const formatVND = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

// Backend serves uploaded files (e.g. "/uploads/xxxx.jpg") from its own origin,
// which differs from the frontend dev server origin — resolve to an absolute URL.
const API_ORIGIN = process.env.REACT_APP_API_ORIGIN || "http://localhost:8080";
const resolveImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/uploads/")) return `${API_ORIGIN}${path}`;
  return path;
};

export default function ProductCard({ product }) {
  const outOfStock = product.status === "OUT_OF_STOCK" || product.quantity === 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative"
    >
      {/* 1. Phần hình ảnh sản phẩm (Image Container) */}
      <div className="relative aspect-[4/3] sm:aspect-square bg-slate-50 overflow-hidden border-b border-slate-50">
        <img
          src={resolveImageUrl(product.image) || "https://placehold.co/600x600?text=Premium+Bike"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Lớp overlay nhẹ khi hover tạo chiều sâu */}
        <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Trạng thái Hết hàng - Thiết kế nổi bật, phủ mờ nhẹ tinh tế */}
        {outOfStock ? (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-slate-900/90 text-white text-xs uppercase tracking-wider font-bold px-3 py-1.5 rounded-full shadow-sm">
              Tạm hết hàng
            </span>
          </div>
        ) : (
          // Nếu còn hàng và là sản phẩm nổi bật (Phần bổ sung thẩm mỹ dựa trên thuộc tính featured)
          product.featured && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md shadow-sm animate-pulse">
              Bán chạy
            </span>
          )
        )}

        {/* Nhãn Thương hiệu (Brand Badge) - Bo góc tinh tế, đổ bóng nhẹ */}
        {product.brandName && !outOfStock && (
          <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm border border-slate-100 tracking-wide uppercase">
            {product.brandName}
          </span>
        )}
      </div>

      {/* 2. Phần nội dung thông tin (Product Info) */}
      <div className="p-4 sm:p-5 flex flex-col justify-between min-h-[160px]">
        <div>
          {/* Danh mục (Category) */}
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1.5">
            {product.categoryName || "Xe đạp"}
          </p>

          {/* Tên sản phẩm (Product Name) */}
          <h3 className="font-semibold text-slate-800 text-sm sm:text-base line-clamp-2 min-h-[2.5rem] sm:min-h-[2.75rem] leading-snug group-hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </h3>
        </div>

        <div>
          {/* Đánh giá sao (Rating & Reviews Count) */}
          <div className="flex items-center gap-1 mt-2.5 text-xs sm:text-sm">
            <div className="text-amber-400 flex items-center drop-shadow-sm">
              {"★".repeat(Math.round(product.averageRating || 0))}
              <span className="text-slate-200">
                {"★".repeat(5 - Math.round(product.averageRating || 0))}
              </span>
            </div>
            <span className="text-slate-400 font-medium text-xs ml-1">
              ({product.reviewCount || 0})
            </span>
          </div>

          {/* Giá tiền và Nút Xem Chi Tiết mô phỏng */}
          <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
            <span className="text-base sm:text-lg font-black text-rose-600 tracking-tight">
              {formatVND(product.price)}
            </span>
            
            {/* Biểu tượng mũi tên nhỏ xuất hiện thanh thoát khi hover vào card */}
            <span className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300 text-sm font-bold flex items-center gap-0.5">
              Xem <span className="text-xs">→</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export { formatVND, resolveImageUrl };