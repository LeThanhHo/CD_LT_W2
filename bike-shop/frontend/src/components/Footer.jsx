// src/components/Footer.jsx
// Senior UI/UX Redesign - Luxury Minimalist Brand Footer (Canyon & Specialized Style)
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, Clock, MapPin, Bike, ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B0F19] text-slate-400 border-t border-white/5 mt-20 font-sans text-xs font-medium select-none">
      
      {/* KHÔNG GIAN LIÊN KẾT CHÍNH - Khoảng cách thoáng rộng chuẩn Vercel */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* CỘT 1: THƯƠNG HIỆU & GIỚI THIỆU TÓM TẮT */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 group">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center font-sans font-black text-xs tracking-tighter text-white">
              B
            </div>
            <span className="font-sans font-black text-base tracking-tight text-white">
              BIKE<span className="text-blue-500 font-medium">SHOP</span>
            </span>
          </div>
          <p className="text-slate-500 leading-relaxed max-w-xs font-medium">
            Chuyên cung cấp giải pháp xe đạp hiệu suất cao chính hãng: từ những cỗ máy tốc độ đường đua đến những dòng xe địa hình carbon nguyên khối thách thức mọi giới hạn.
          </p>
        </div>

        {/* CỘT 2: DANH MỤC MUA SẮM - Hiệu ứng trượt nhẹ khi hover */}
        <div className="space-y-4">
          <h4 className="font-sans font-black text-white uppercase tracking-wider text-[11px]">Mua sắm</h4>
          <ul className="space-y-2.5 font-bold">
            <li>
              <Link 
                to="/products" 
                className="group flex items-center gap-1 text-slate-400 hover:text-white hover:translate-x-0.5 transition-all duration-200"
              >
                <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-500 transition-colors" />
                Tất cả sản phẩm
              </Link>
            </li>
            <li>
              <Link 
                to="/products?sortBy=newest" 
                className="group flex items-center gap-1 text-slate-400 hover:text-white hover:translate-x-0.5 transition-all duration-200"
              >
                <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-500 transition-colors" />
                Dòng xe mới về
              </Link>
            </li>
          </ul>
        </div>

        {/* CỘT 3: TRUNG TÂM HỖ TRỢ KHÁCH HÀNG */}
        <div className="space-y-4">
          <h4 className="font-sans font-black text-white uppercase tracking-wider text-[11px]">Hỗ trợ khách hàng</h4>
          <ul className="space-y-3 font-semibold text-slate-400">
            <li className="flex items-center gap-2.5">
              <Phone className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Hotline: <span className="text-slate-200 font-bold hover:text-blue-500 transition-colors cursor-pointer">0398 820 547</span></span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span className="truncate">Email: <span className="text-slate-200 font-bold hover:text-blue-500 transition-colors cursor-pointer">lethanhho.hb2005@gmail.com</span></span>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Giờ làm việc: <span className="text-slate-300 font-medium">8:00 - 21:00</span></span>
            </li>
          </ul>
        </div>

        {/* CỘT 4: ĐỊA CHỈ TRỤ SỞ HỆ THỐNG */}
        <div className="space-y-4">
          <h4 className="font-sans font-black text-white uppercase tracking-wider text-[11px]">Địa chỉ hệ thống</h4>
          <div className="flex items-start gap-2.5 font-semibold text-slate-400 leading-relaxed max-w-[220px]">
            <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
            <span className="text-slate-300 font-medium">
              Đường số 18 Linh Xuân <br />
              TP. Hồ Chí Minh
            </span>
          </div>
        </div>

      </div>

      {/* CHÂN ĐẾ BẢN QUYỀN - Đường line mảnh tinh tế phong cách Apple */}
      <div className="border-t border-white/5 py-6 bg-black/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-600 font-bold text-[11px]">
          <p>© {new Date().getFullYear()} BikeShop Authority. Đã đăng ký bản quyền.</p>
          <p className="text-slate-500 font-medium">Thiết kế bởi <span className="text-blue-500 hover:text-blue-400 transition-colors cursor-pointer">Le Thanh Ho</span></p>
          
        </div>
      </div>

    </footer>
  );
}