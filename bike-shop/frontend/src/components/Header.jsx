// src/components/Header.jsx
// Senior UI/UX Redesign - Premium Glassmorphism Navigation (Apple & Canyon Style)
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  ShoppingCart, 
  Search, 
  User, 
  LogOut, 
  Shield, 
  ShoppingBag, 
  Menu, 
  X,
  ChevronDown
} from "lucide-react";
import { logout } from "../context/authSlice";
import { clearCartState } from "../context/cartSlice";
import NotificationBell from "./NotificationBell";

export default function Header() {
  const [keyword, setKeyword] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    navigate(`/products?keyword=${encodeURIComponent(keyword)}`);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartState());
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur-md text-white border-b border-white/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* LOGO ZONE - Specialized & Canyon Vibe */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center font-sans font-black text-xs tracking-tighter text-white group-hover:scale-105 transition-transform">
              B
            </div>
            <span className="font-sans font-black text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
              BIKE<span className="text-blue-500 font-medium">SHOP</span>
            </span>
          </Link>

          {/* SEARCH BAR - Apple / Notion Minimalist Style */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm dòng xe, nhãn hiệu, phụ kiện carbon..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white/10 text-white placeholder-gray-500 transition duration-200"
              />
            </div>
          </form>

          {/* DESKTOP NAVIGATION ZONE - Micro-interactions */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
            <Link to="/products" className="text-gray-300 hover:text-white transition-colors py-1">
              Sản phẩm
            </Link>
            <Link to="/posts" className="text-gray-300 hover:text-white transition-colors py-1">
              Bài viết
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors py-1">
              Liên hệ
            </Link>

            <div className="h-4 w-px bg-white/10 mx-1" />

            {/* Favorite Action Link */}
            {isAuthenticated && (
              <Link to="/favorites" className="text-gray-300 hover:text-red-500 transition-colors relative p-1" aria-label="Yêu thích">
                <Heart size={18} className="transition-transform active:scale-90" />
              </Link>
            )}

            {/* Premium Shopping Cart Cart Badge Link */}
            <Link to="/cart" className="relative text-gray-300 hover:text-blue-400 transition-colors p-1" aria-label="Giỏ hàng">
              <ShoppingCart size={18} className="transition-transform active:scale-90" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[9px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center border border-[#0F172A]"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Core Notification Bell Component */}
            {isAuthenticated && <NotificationBell />}

            {/* User Dropdown Identity System */}
            {isAuthenticated ? (
              <div className="relative group/user py-2">
                <button className="flex items-center gap-2 text-gray-200 hover:text-white focus:outline-none transition">
                  <div className="w-6 h-6 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black rounded-md flex items-center justify-center text-[10px] uppercase shadow-sm">
                    {user?.fullname ? user.fullname.charAt(0) : "U"}
                  </div>
                  {/* 🎯 ĐÃ SỬA: Hiển thị ĐẦY ĐỦ họ tên người dùng trên Desktop */}
                  <span className="normal-case font-bold max-w-[120px] truncate">{user?.fullname || "Rider"}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400 group-hover/user:rotate-180 transition-transform duration-300" />
                </button>
                
                {/* Stripe-style Dropdown Menu */}
                <div className="absolute right-0 top-full pt-2 hidden group-hover/user:block w-52">
                  <div className="bg-[#111827] border border-white/10 rounded-xl shadow-xl py-1.5 overflow-hidden text-left font-sans normal-case text-xs">
                    {/* Hiển thị họ tên đầy đủ trong dropdown để tăng trải nghiệm cá nhân hóa */}
                    <div className="px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                      <p className="font-bold text-white text-[11px] truncate">{user?.fullname}</p>
                      <p className="text-[10px] text-gray-500 truncate mt-0.5">{user?.email}</p>
                    </div>
                    <Link to="/orders" className="flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition mt-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-gray-400" /> Đơn hàng của tôi
                    </Link>
                    <Link to="/favorites" className="flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition">
                      <Heart className="w-3.5 h-3.5 text-gray-400" /> Sản phẩm yêu thích
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition">
                      <User className="w-3.5 h-3.5 text-gray-400" /> Hồ sơ cá nhân
                    </Link>
                    {(user?.role === "ADMIN" || user?.role === "STAFF") && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-blue-400 hover:text-white hover:bg-blue-600 transition border-t border-white/5 mt-1 pt-2">
                        <Shield className="w-3.5 h-3.5" /> Quản trị hệ thống
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400 hover:text-white hover:bg-red-600/20 transition border-t border-white/5 mt-1 pt-2"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Đăng xuất tài khoản
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-white text-[#0F172A] hover:bg-blue-600 hover:text-white text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-200 active:scale-95 shadow-sm shadow-white/5">
                Đăng nhập
              </Link>
            )}
          </nav>

          {/* HAMBURGER TRIGGER BUTTON FOR MOBILE */}
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE EXPANDED DRAWER MENU WITH SMOOTH REVEAL */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-[#111827] border-t border-white/5 px-6 py-4 space-y-4 font-sans text-xs font-semibold"
          >
            {/* Mobile Search input */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm mẫu xe đạp..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-white"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl text-xs font-bold transition">
                Tìm
              </button>
            </form>

            <div className="flex flex-col space-y-2.5 pt-2">
              {isAuthenticated && (
                /* 🎯 ĐÃ SỬA: Hiển thị ĐẦY ĐỦ họ tên người dùng trên thanh Mobile Menu */
                <div className="flex items-center gap-2 pb-2 mb-1 border-b border-white/5 text-gray-400 normal-case">
                  <div className="w-5 h-5 bg-blue-600 text-white font-black rounded-md flex items-center justify-center text-[9px]">
                    {user?.fullname ? user.fullname.charAt(0) : "U"}
                  </div>
                  <span className="font-bold text-white text-[11px] truncate">Xin chào, {user?.fullname}</span>
                </div>
              )}

              <Link to="/products" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-300 hover:text-white border-b border-white/5">Sản phẩm</Link>
              <Link to="/posts" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-300 hover:text-white border-b border-white/5">Bài viết</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-300 hover:text-white border-b border-white/5">Liên hệ</Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-2 text-gray-300 hover:text-white border-b border-white/5">
                <span>Giỏ hàng</span>
                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{totalItems}</span>
              </Link>
              
              {isAuthenticated ? (
                <div className="space-y-2.5 pt-2">
                  <Link to="/favorites" onClick={() => setMenuOpen(false)} className="block py-1 text-gray-400 hover:text-white">Yêu thích</Link>
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="block py-1 text-gray-400 hover:text-white">Đơn hàng của tôi</Link>
                  {(user?.role === "ADMIN" || user?.role === "STAFF") && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-1 text-blue-400 hover:text-white">Trang quản trị</Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left py-2 text-red-400 border-t border-white/5 mt-2 flex items-center gap-1">
                    <LogOut className="w-3.5 h-3.5" /> Đăng xuất tài khoản
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-center bg-white text-[#0F172A] py-2.5 rounded-xl font-bold mt-2">
                  Đăng nhập hệ thống
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}