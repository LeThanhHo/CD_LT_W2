// src/layouts/AdminLayout.jsx
// Senior UI/UX Redesign - Premium SaaS Dashboard (Vercel & Stripe Style)

import React, { useState } from "react";
import { NavLink, Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../context/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Bike,
  ShoppingCart,
  Star,
  Newspaper,
  MessageSquare,
  Users as UsersIcon,
  Image as ImageIcon,
  LogOut,
  Home,
  Menu,
  X,
  Search,
  Bell,
  ChevronRight,
  UserCheck
} from "lucide-react";

// Ánh xạ chính xác các Icon theo yêu cầu hệ thống định vị SaaS năm 2025
const navItems = [
  { to: "/admin", label: "Tổng quan", end: true, icon: LayoutDashboard },
  { to: "/admin/products", label: "Sản phẩm", icon: Package },
  { to: "/admin/categories", label: "Danh mục", icon: FolderTree },
  { to: "/admin/brands", label: "Hãng xe", icon: Bike },
  { to: "/admin/orders", label: "Đơn hàng", icon: ShoppingCart },
  { to: "/admin/reviews", label: "Đánh giá", icon: Star },
  { to: "/admin/posts", label: "Bài viết", icon: Newspaper },
  { to: "/admin/contacts", label: "Liên hệ", icon: MessageSquare },
  { to: "/admin/users", label: "Người dùng", icon: UsersIcon },
  { to: "/admin/banners", label: "Banner", icon: ImageIcon },
];

export default function AdminLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Các State hỗ trợ cơ chế Responsive và mở rộng Dropdown UI/UX không ảnh hưởng tới logic nghiệp vụ
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Hàm sinh Breadcrumb tự động dựa trên Router hiện tại để gia tăng trải nghiệm SaaS chuyên nghiệp
  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter((p) => p);
    return paths.map((p, index) => {
      const label = p === "admin" ? "Dashboard" : p.charAt(0).toUpperCase() + p.slice(1);
      return { label, isLast: index === paths.length - 1 };
    });
  };

  // Component Sidebar chứa cấu trúc Menu được chuẩn hóa, tái sử dụng trên cả Desktop và Drawer Mobile
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#111827] text-gray-100 font-sans">
      {/* BRANDING LOGO ZONE - Vercel Minimalist Style */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-black text-sm tracking-tighter">B</span>
          </div>
          <span className="font-bold tracking-tight text-lg text-white">
            BIKE<span className="text-blue-500 font-medium">SHOP</span>
          </span>
          <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400 font-medium tracking-wide">
            v2.5
          </span>
        </div>
        {/* Nút đóng Sidebar trên màn hình di động */}
        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* NAVIGATION ITEMS ZONE - Khoảng cách thoáng rộng, Micro-interactions tinh tế */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/10 font-semibold"
                    : "text-gray-400 hover:text-gray-100 hover:bg-gray-800/40 hover:translate-x-1"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-49 h-4.5 transition-transform duration-300 group-hover:rotate-6 ${
                      isActive ? "text-white" : "text-gray-400 group-hover:text-blue-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ADMIN SESSION PROFILE CARD - Khung chân trang Sidebar cao cấp */}
      <div className="p-4 border-t border-gray-800/60 bg-gray-900/40">
        <div className="flex items-center gap-3 p-2 bg-gray-800/30 rounded-xl border border-gray-800/40 mb-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-inner">
            {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.fullname || "Quản trị viên"}</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Master Admin
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 px-1">
          <Link
            to="/"
            className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-blue-400 bg-gray-800/50 hover:bg-gray-800 py-2 rounded-lg border border-gray-800 transition"
          >
            <Home className="w-3 h-3" /> Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-red-400 hover:text-white bg-red-950/20 hover:bg-red-600 py-2 rounded-lg border border-red-900/30 hover:border-red-600 transition"
          >
            <LogOut className="w-3 h-3" /> Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-[#0F172A] antialiased">
      {/* DESKTOP SIDEBAR - Bo góc mặt phải tinh tế dạng rounded-r-3xl theo chỉ thị */}
      <aside className="hidden md:flex w-66 h-screen sticky top-0 flex-col shrink-0 overflow-hidden border-r border-gray-200/50 shadow-sm z-30 rounded-r-3xl">
        <SidebarContent />
      </aside>

      {/* MOBILE DRAWER SIDEBAR - Hiển thị mượt mà thông qua AnimatePresence */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-66 z-50 md:hidden shadow-2xl overflow-hidden rounded-r-3xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* CHÂN KHÔNG GIAN MAIN CONTENT & HEADER */}
      <div className="flex-1 min-w-0 flex flex-col relative">
        

        {/* KHÔNG GIAN NỘI DUNG CHÍNH (MAIN ZONE) - Chứa hiệu ứng Fade up tăng trưởng cao cấp */}
        <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-8 relative">
          {/* Lớp phủ màu background gradient rất nhẹ tạo chiều sâu cho trang thái hiển thị dữ liệu */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 via-transparent to-transparent pointer-events-none z-0" />
          
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10 h-full"
          >
            {/* Giữ nguyên vẹn Outlet - Đảm bảo kiến trúc Router và Data Flow của dự án */}
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}