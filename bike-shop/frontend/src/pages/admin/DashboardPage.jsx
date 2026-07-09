// src/pages/admin/DashboardPage.jsx
// Senior UI/UX Redesign - SaaS Minimal Dashboard (Stripe & shadcn/ui style)
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  UserPlus, 
  Sparkles, 
  ArrowUpRight 
} from "lucide-react";
import dashboardService from "../../services/dashboardService";
import { formatVND, resolveImageUrl } from "../../components/ProductCard";
import Loader from "../../components/Loader";

// 🎯 COMPONENT THẺ THỐNG KÊ BIẾN ĐỔI VI TƯƠNG TÁC CAO CẤP
const StatCard = ({ label, value, icon: Icon, accentClass, bgIconClass, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
    whileHover={{ y: -4, shadow: "0 12px 30px rgba(0,0,0,0.04)" }}
    className="bg-white border border-gray-200/60 rounded-2xl p-6 transition-shadow duration-300 relative overflow-hidden group"
  >
    {/* Hiệu ứng tia sáng phản chiếu mờ khi hover */}
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gray-50/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
    
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
      <div className={`w-9 h-9 ${bgIconClass || "bg-gray-50"} rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3`}>
        <Icon className={`w-4.5 h-4.5 ${accentClass || "text-gray-500"}`} />
      </div>
    </div>
    <div className="mt-4 flex items-baseline gap-1.5">
      <h3 className="text-2xl font-bold tracking-tight text-gray-900">{value}</h3>
    </div>
  </motion.div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Lỗi đồng bộ dữ liệu tổng quan:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 font-sans">
      {/* TIÊU ĐỀ KHỐI - Bám sát tinh thần Minimalist */}
      <div className="flex items-center justify-between border-b border-gray-200/40 pb-5">
        <div>
          <h1 className="font-sans font-extrabold text-2xl tracking-tight text-gray-900">Tổng quan hệ thống</h1>
          <p className="text-xs text-gray-400 mt-1">Cập nhật chỉ số kinh doanh và hiệu suất vận hành theo thời gian thực.</p>
        </div>
      </div>

      {/* LƯỚI THẺ SỐ LIỆU CAO CẤP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          index={0}
          label="Tổng doanh thu" 
          value={formatVND(stats?.totalRevenue)} 
          icon={DollarSign}
          accentClass="text-blue-600"
          bgIconClass="bg-blue-50"
        />
        <StatCard 
          index={1}
          label="Tổng đơn hàng" 
          value={stats?.totalOrders ?? 0} 
          icon={ShoppingBag}
          accentClass="text-emerald-600"
          bgIconClass="bg-emerald-50"
        />
        <StatCard 
          index={2}
          label="Tổng sản phẩm" 
          value={stats?.totalProducts ?? 0} 
          icon={Package}
          accentClass="text-indigo-600"
          bgIconClass="bg-indigo-50"
        />
        <StatCard 
          index={3}
          label="Tổng khách hàng" 
          value={stats?.totalCustomers ?? 0} 
          icon={Users}
          accentClass="text-amber-600"
          bgIconClass="bg-amber-50"
        />
      </div>

      {/* KHÔNG GIAN PHÂN TÍCH DỮ LIỆU ĐỘ SÂU CHI TIẾT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TRÁI: DANH SÁCH SẢN PHẨM BÁN CHẠY (Apple Table Style) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col"
        >
          <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
            <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" /> Sản phẩm bán chạy nhất
            </h2>
            <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Top Performance</span>
          </div>

          {stats?.bestSellingProducts && stats.bestSellingProducts.length > 0 ? (
            <div className="divide-y divide-gray-100 flex-1">
              {stats.bestSellingProducts.map((p) => (
                <div key={p.productId} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0 group">
                  <div className="relative w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center p-1 transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={resolveImageUrl(p.productImage) || "https://placehold.co/40x40?text=Bike"}
                      alt=""
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{p.productName}</p>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">ID: #{p.productId}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center bg-gray-50 px-3 py-1 rounded-full border border-gray-200/60 text-xs font-bold text-gray-700">
                      Đã bán <span className="text-blue-600 ml-1 font-extrabold">{p.totalSold}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center flex-1">
              <p className="text-sm text-gray-400 font-medium">Chưa phát sinh dữ liệu bán hàng trong kỳ.</p>
            </div>
          )}
        </motion.div>

        {/* PHẢI: KHÁCH HÀNG MỚI & TRẠNG THÁI CHÀO MỪNG */}
        <div className="space-y-6 flex flex-col justify-between">
          
          {/* KHỐI CHỈ SỐ KHÁCH HÀNG MỚI TRONG THÁNG */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group flex-1 flex flex-col justify-center"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-500" />
            <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <UserPlus className="w-4 h-4 text-emerald-500" /> Tăng trưởng tài khoản
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight text-gray-900">
                {stats?.newCustomersThisMonth ?? 0}
              </span>
              <span className="text-xs text-emerald-500 font-bold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center">
                New <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-medium mt-3">
              Số lượng tài khoản khách hàng đăng ký mới trên hệ thống BikeShop kể từ đầu tháng này.
            </p>
          </motion.div>

          {/* KHỐI THÔNG ĐIỆP HƯỚNG DẪN HỆ THỐNG */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-gradient-to-r from-gray-900 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex-1 flex flex-col justify-center"
          >
            <div className="absolute -right-6 -bottom-6 opacity-[0.04] text-white pointer-events-none">
              <Sparkles className="w-36 h-36" />
            </div>
            <h2 className="font-bold text-sm tracking-tight flex items-center gap-2 mb-2 text-white">
              <Sparkles className="w-4 h-4 text-blue-400" /> Trung tâm điều hành BikeShop
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              Chào mừng trở lại! Sử dụng bảng điều khiển và hệ thống thanh điều hướng bên trái để quản lý danh mục xe, thông tin hãng, theo dõi vòng đời đơn hàng, kiểm duyệt các đánh giá và xuất bản bài viết tạp chí.
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}