import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="font-display text-lg mb-3">
            <span className="text-volt">BIKE</span>SHOP
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            Chuyên cung cấp xe đạp chính hãng: xe đua, xe địa hình, xe touring, xe điện.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-volt">Mua sắm</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/products" className="hover:text-white">Tất cả sản phẩm</Link></li>
            <li><Link to="/products?sortBy=newest" className="hover:text-white">Xe mới về</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-volt">Hỗ trợ khách hàng</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Hotline: 1900 8386</li>
            <li>Email: support@bikeshop.vn</li>
            <li>Giờ làm việc: 8:00 - 21:00</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-volt">Địa chỉ</h4>
          <p className="text-sm text-white/70">123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} BikeShop. Đã đăng ký bản quyền.
      </div>
    </footer>
  );
}
