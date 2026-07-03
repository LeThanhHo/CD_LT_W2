import React from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../context/authSlice";

const navItems = [
  { to: "/admin", label: "Tổng quan", icon: "📊", end: true },
  { to: "/admin/products", label: "Sản phẩm", icon: "🚲" },
  { to: "/admin/categories", label: "Danh mục", icon: "🗂️" },
  { to: "/admin/brands", label: "Hãng xe", icon: "🏷️" },
  { to: "/admin/orders", label: "Đơn hàng", icon: "📦" },
  { to: "/admin/users", label: "Người dùng", icon: "👥" },
  { to: "/admin/posts", label: "Bài viết", icon: "✍️" },
];

export default function AdminLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    /* h-screen và overflow-hidden ép toàn bộ giao diện lớn luôn luôn bằng đúng 1 màn hình, không cho cuộn tổng */
    <div className="h-screen w-screen flex bg-slate-50 text-slate-800 font-sans antialiased overflow-hidden">
      
      {/* 1. SIDEBAR - ĐỨNG YÊN TUYỆT ĐỐI */}
      <aside className="w-64 h-full bg-slate-900 text-white flex flex-col shrink-0 border-r border-white/5 shadow-xl z-20">
        
        {/* Brand Logo Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 gap-2 group shrink-0">
          <div className="w-2.5 h-6 bg-gradient-to-b from-lime-400 to-emerald-500 rounded-full group-hover:scale-y-110 transition-transform duration-300" />
          <div className="font-black text-lg tracking-wider">
            <span className="text-lime-400">BIKE</span>SHOP
            <span className="text-[10px] tracking-widest uppercase text-slate-400 block font-bold -mt-1">
              Hệ thống Admin
            </span>
          </div>
        </div>

        {/* Navigation Menu List - Tự cuộn nội bộ nếu menu quá dài */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ease-out group ${
                  isActive
                    ? "bg-gradient-to-r from-lime-400 to-lime-500 text-slate-900 shadow-md shadow-lime-500/10 scale-[1.02]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`text-base transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-125"}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {isActive && <span className="text-xs font-black animate-fade-in text-slate-800">•</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Sidebar - Tài khoản */}
        <div className="p-4 bg-slate-950/40 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-3 mb-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-lime-400 to-emerald-500 text-slate-900 flex items-center justify-center font-black text-sm">
              {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-slate-100 truncate leading-tight">
                {user?.fullname || "Quản trị viên"}
              </p>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                {user?.role || "ADMIN"}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center border-t border-white/5 pt-3 px-2 text-xs font-bold">
            <Link to="/" className="text-slate-400 hover:text-lime-400 hover:underline transition-colors flex items-center gap-1">
              🌐 Cửa hàng
            </Link>
            <button onClick={handleLogout} className="text-slate-400 hover:text-rose-400 hover:underline transition-colors flex items-center gap-1">
              🚪 Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* 2. KHU VỰC BÊN PHẢI - NỘI DUNG VÀ HEADER PHỤ */}
      <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar - ĐỨNG YÊN TUYỆT ĐỐI */}
        <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0 relative z-10">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span>Hệ thống nội bộ</span>
           
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Mốc thời gian hệ thống: <span className="font-bold text-slate-600">{new Date().toLocaleDateString("vi-VN")}</span>
          </div>
        </header>

        {/* VÙNG CUỘN ĐỘC LẬP - Nội dung trang con thay đổi ở đây, layout ngoài không bị ảnh hưởng */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 custom-scrollbar">
          <div className="p-6 md:p-8 animate-fade-in-up w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* CSS Styles nhúng giữ nguyên */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .aside .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
        }
      `}</style>

    </div>
  );
}