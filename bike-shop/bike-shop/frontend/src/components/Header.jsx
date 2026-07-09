import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
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
    navigate(`/products?keyword=${encodeURIComponent(keyword)}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartState());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-ink text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-volt text-xl tracking-tight">BIKE</span>
            <span className="font-display text-white text-xl tracking-tight">SHOP</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm xe đạp, hãng, loại xe..."
              className="w-full px-4 py-2 rounded-l-md text-ink text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-volt text-ink px-4 rounded-r-md font-semibold text-sm hover:brightness-95"
            >
              Tìm
            </button>
          </form>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/products" className="hover:text-volt transition-colors">
              Sản phẩm
            </Link>
            <Link to="/posts" className="hover:text-volt transition-colors">
              Bài viết
            </Link>
            <Link to="/contact" className="hover:text-volt transition-colors">
              Liên hệ
            </Link>

            {isAuthenticated && (
              <Link to="/favorites" className="hover:text-volt transition-colors" aria-label="Yêu thích">
                <Heart size={20} />
              </Link>
            )}

            <Link to="/cart" className="relative hover:text-volt transition-colors">
              Giỏ hàng
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-ember text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated && <NotificationBell />}

            {isAuthenticated ? (
              <div className="relative group">
                <button className="hover:text-volt transition-colors">
                  {user?.fullname?.split(" ").pop() || "Tài khoản"}
                </button>
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                  <div className="bg-white text-ink rounded-md shadow-lg w-48 py-2">
                    <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      Đơn hàng của tôi
                    </Link>
                    <Link to="/favorites" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      Sản phẩm yêu thích
                    </Link>
                    {(user?.role === "ADMIN" || user?.role === "STAFF") && (
                      <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-gray-100">
                        Trang quản trị
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-ember"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hover:text-volt transition-colors">
                Đăng nhập
              </Link>
            )}
          </nav>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-ink border-t border-white/10 px-4 py-3 space-y-3">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full px-3 py-2 rounded-l-md text-ink text-sm"
            />
            <button type="submit" className="bg-volt text-ink px-3 rounded-r-md text-sm font-semibold">
              Tìm
            </button>
          </form>
          <Link to="/products" className="block py-1">Sản phẩm</Link>
          <Link to="/posts" className="block py-1">Bài viết</Link>
          <Link to="/contact" className="block py-1">Liên hệ</Link>
          <Link to="/cart" className="block py-1">Giỏ hàng ({totalItems})</Link>
          {isAuthenticated ? (
            <>
              <Link to="/favorites" className="block py-1">Yêu thích</Link>
              <Link to="/orders" className="block py-1">Đơn hàng của tôi</Link>
              {(user?.role === "ADMIN" || user?.role === "STAFF") && (
                <Link to="/admin" className="block py-1">Trang quản trị</Link>
              )}
              <button onClick={handleLogout} className="block py-1 text-ember">Đăng xuất</button>
            </>
          ) : (
            <Link to="/login" className="block py-1">Đăng nhập</Link>
          )}
        </div>
      )}
    </header>
  );
}
