import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../context/authSlice";
import { clearCartState } from "../context/cartSlice";

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
    navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartState());
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md text-white shadow-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-6">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-1.5 shrink-0 group">
            <span className="font-black text-xl sm:text-2xl tracking-tight text-gradient bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-emerald-400 transition-all duration-300">
              BIKE
            </span>
            <span className="font-black text-xl sm:text-2xl tracking-tight text-white group-hover:text-lime-400 transition-colors duration-300">
              SHOP
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg relative group">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm xe đạp, hãng, loại xe..."
              className="w-full pl-4 pr-14 py-2 rounded-xl bg-white/10 text-white placeholder-slate-400 text-sm border border-white/10 focus:outline-none focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 focus:border-lime-400 focus:shadow-[0_0_15px_rgba(163,230,53,0.15)] transition-all duration-300"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-lime-400 text-slate-900 px-3.5 py-1 rounded-lg font-bold text-xs hover:bg-lime-300 active:scale-95 transition-all duration-200"
            >
              Tìm
            </button>
          </form>

          {/* Navigation & Actions */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
            <Link to="/products" className="text-slate-300 hover:text-lime-400 transition-colors duration-200">
              Sản phẩm
            </Link>
            
            {/* Cart Icon Badge */}
            <Link to="/cart" className="relative text-slate-300 hover:text-lime-400 transition-colors duration-200 flex items-center gap-1.5 group">
              <span>Giỏ hàng</span>
              <div className="relative py-1">
                <span className="text-lg group-hover:scale-110 transition-transform duration-200">🛒</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-slate-900 animate-fade-in shadow-sm">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>

            {/* Profile Dropdown Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-1 text-slate-200 hover:text-lime-400 font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5 transition-all duration-200">
                  <span>{user?.fullname?.split(" ").pop() || "Tài khoản"}</span>
                  <span className="text-[10px] opacity-60 group-hover:rotate-180 transition-transform duration-300">▼</span>
                </button>
                
                {/* Dropdown Box Overlay */}
                <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="bg-white text-slate-800 rounded-xl shadow-xl w-52 py-2 border border-slate-100 overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-50">
                      <p className="text-xs text-slate-400 font-medium">Xin chào,</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.fullname}</p>
                    </div>
                    <Link to="/orders" className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                      📦 Đơn hàng của tôi
                    </Link>
                    {(user?.role === "ADMIN" || user?.role === "STAFF") && (
                      <Link to="/admin" className="block px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50/50 transition-colors">
                        ⚙️ Trang quản trị
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-50"
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-lime-400 hover:bg-lime-300 text-slate-900 px-5 py-2 rounded-xl text-sm font-extrabold shadow-md shadow-lime-400/10 active:scale-98 transition-all duration-200"
              >
                Đăng nhập
              </Link>
            )}
          </nav>

          {/* Mobile Hamburger Trigger Toggle */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all duration-200" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <div className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1" : ""}`} />
            <div className={`w-5 h-0.5 bg-white rounded-full my-1 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <div className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel Drawer */}
      <div className={`md:hidden overflow-hidden bg-slate-900/98 backdrop-blur-xl border-t border-white/5 transition-all duration-300 ease-in-out ${menuOpen ? "max-h-[400px] opacity-100 py-4" : "max-h-0 opacity-0 pointer-events-none"}`}>
        <div className="px-4 space-y-4">
          <form onSubmit={handleSearch} className="flex relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-slate-400 text-sm border border-white/5 focus:outline-none focus:border-lime-400"
            />
            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-lime-400 text-slate-900 px-3.5 py-1 rounded-lg font-bold text-xs">
              Tìm
            </button>
          </form>
          
          <div className="space-y-1 font-medium text-slate-300">
            <Link to="/products" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-white/5 active:text-lime-400 transition-all">
              🚲 Sản phẩm
            </Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-white/5 active:text-lime-400 flex items-center justify-between transition-all">
              <span>🛒 Giỏ hàng</span>
              {totalItems > 0 && <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{totalItems}</span>}
            </Link>
            
            {isAuthenticated ? (
              <div className="pt-2 border-t border-white/5 space-y-1">
                <div className="px-3 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Tài khoản</div>
                <Link to="/orders" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-white/5 transition-all">
                  📦 Đơn hàng của tôi
                </Link>
                {(user?.role === "ADMIN" || user?.role === "STAFF") && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-blue-950 text-blue-400 font-bold transition-all">
                    ⚙️ Trang quản trị
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left py-2 px-3 rounded-lg text-rose-400 font-bold hover:bg-rose-950/30 transition-all"
                >
                  🚪 Đăng xuất ({user?.fullname})
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-white/5">
                <Link 
                  to="/login" 
                  onClick={() => setMenuOpen(false)} 
                  className="block w-full text-center bg-lime-400 text-slate-900 font-extrabold py-2.5 rounded-xl transition-all"
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}