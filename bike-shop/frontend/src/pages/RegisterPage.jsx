// src/pages/RegisterPage.jsx
// Senior UI/UX Redesign - Premium User Registration Gateway
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { User, Lock, Mail, Smartphone, MapPin, UserPlus, ArrowRight, ShieldCheck } from "lucide-react";
import authService from "../services/authService";
import { setCredentials } from "../context/authSlice";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullname: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.register(form);
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      toast.success("Chào mừng bạn đã gia nhập BikeShop!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại, vui lòng kiểm tra lại thông tin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 md:px-8 py-16 bg-slate-50/50 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-xl bg-white rounded-3xl border border-slate-200/80 p-8 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Khởi tạo tài khoản</h1>
          <p className="text-xs text-slate-400 font-medium">Trở thành thành viên BikeShop để nhận ưu đãi và quản lý đơn hàng chuyên sâu.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Họ và tên</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input name="fullname" value={form.fullname} onChange={handleChange} required placeholder="Nguyễn Văn A"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tên đăng nhập</label>
            <div className="relative">
              <UserPlus className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input name="username" value={form.username} onChange={handleChange} required placeholder="username_..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mật khẩu</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email cá nhân</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="email@domain.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Số điện thoại</label>
            <div className="relative">
              <Smartphone className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="090x xxx xxx"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Địa chỉ giao hàng</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
              <input name="address" value={form.address} onChange={handleChange} placeholder="Số nhà, đường, quận/huyện..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold" />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="md:col-span-2 mt-2 h-11 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all duration-200 disabled:opacity-60 shadow-lg shadow-blue-600/20"
          >
            {loading ? "Đang khởi tạo tài khoản..." : "Xác nhận đăng ký"}
          </motion.button>
        </form>

        <p className="text-xs text-slate-400 mt-8 text-center font-semibold">
          Đã có tài khoản Rider?{" "}
          <Link to="/login" className="text-blue-600 font-extrabold hover:text-blue-700 transition inline-flex items-center gap-0.5 hover:underline">
            Đăng nhập ngay <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
        
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[9px] font-bold text-slate-300 uppercase tracking-widest text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-300" /> Hệ thống bảo mật thông tin tuyệt đối
        </div>
      </motion.div>
    </div>
  );
}