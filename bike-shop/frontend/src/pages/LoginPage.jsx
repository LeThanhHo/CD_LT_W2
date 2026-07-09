// src/pages/LoginPage.jsx
// Senior UI/UX Redesign - Premium Identity Authentication Interface (Apple & Vercel Style)
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { User, Lock, LogIn, ShieldCheck, ArrowRight } from "lucide-react";
import authService from "../services/authService";
import { setCredentials } from "../context/authSlice";
import { fetchCart } from "../context/cartSlice";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(form);
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      dispatch(fetchCart());
      toast.success("Chào mừng quay trở lại, Rider!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 md:px-8 bg-slate-50/50 font-sans text-slate-900">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)] relative"
      >
        {/* LOGO DECORATION */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-sans font-black text-xs tracking-tighter text-white">
            B
          </div>
          <span className="font-sans font-black text-base tracking-tight text-[#0F172A]">
            BIKE<span className="text-blue-500 font-medium">SHOP</span>
          </span>
        </div>

        <div className="text-center space-y-1 mb-8">
          <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">Đăng nhập tài khoản</h1>
          <p className="text-xs text-slate-400 font-medium">Chào mừng bạn quay lại hệ thống BikeShop.</p>
        </div>

        {/* CORE FORM PORTAL */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tên đăng nhập</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="Nhập tên tài khoản của bạn..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mật khẩu bảo mật</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Nhập mật khẩu an toàn..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold"
              />
            </div>
          </div>

          <div className="pt-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 disabled:opacity-60 shadow-md shadow-blue-600/10 flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              {loading ? "Đang xử lý dữ liệu..." : "Đăng nhập ngay"}
            </motion.button>
          </div>
        </form>

        {/* REDIRECT ANCHOR LINK */}
        <p className="text-xs text-slate-400 mt-6 text-center font-semibold">
          Chưa có tài khoản Rider?{" "}
          <Link to="/register" className="text-blue-600 font-extrabold hover:text-blue-700 transition inline-flex items-center gap-0.5 hover:underline">
            Đăng ký ngay <ArrowRight className="w-3 h-3" />
          </Link>
        </p>

        {/* BOTTOM SECURE FOOTNOTE */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[9px] font-bold text-slate-300 uppercase tracking-widest text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-300" /> Cổng bảo mật dữ liệu khách hàng
        </div>

      </motion.div>
    </div>
  );
}