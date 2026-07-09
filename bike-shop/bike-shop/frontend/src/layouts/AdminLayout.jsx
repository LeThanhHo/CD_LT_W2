import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../context/authSlice";
import { useNavigate } from "react-router-dom";

const navItems = [
  { to: "/admin", label: "Tổng quan", end: true },
  { to: "/admin/products", label: "Sản phẩm" },
  { to: "/admin/categories", label: "Danh mục" },
  { to: "/admin/brands", label: "Hãng xe" },
  { to: "/admin/orders", label: "Đơn hàng" },
  { to: "/admin/reviews", label: "Đánh giá" },
  { to: "/admin/posts", label: "Bài viết" },
  { to: "/admin/contacts", label: "Liên hệ" },
  { to: "/admin/users", label: "Người dùng" },
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
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-ink text-white flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 font-display text-lg">
          <span className="text-volt">BIKE</span>SHOP
          <span className="text-xs font-body font-normal text-white/50 ml-2">Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "bg-volt text-ink" : "text-white/80 hover:bg-white/10"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-sm text-white/70 mb-2">{user?.fullname}</p>
          <div className="flex gap-2">
            <Link to="/" className="text-xs text-volt hover:underline">Về trang chủ</Link>
            <button onClick={handleLogout} className="text-xs text-ember hover:underline">
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <main className="p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
