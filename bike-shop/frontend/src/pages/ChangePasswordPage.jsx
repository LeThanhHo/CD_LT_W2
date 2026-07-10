// src/pages/ChangePasswordPage.jsx
// Senior UI/UX Redesign - Secure Password Modification Interface
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Lock, ShieldAlert, Key, ShieldCheck } from "lucide-react";
import authService from "../services/authService";
import { logout } from "../context/authSlice";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải từ 6 ký tự trở lên");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.changePassword(form.oldPassword, form.newPassword);
      toast.success(res.data.message || "Cập nhật khóa bảo mật thành công!");
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể thay đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 md:px-8 py-12 bg-slate-50/50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Key className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">Thay đổi mật khẩu</h1>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">Cập nhật khóa truy cập để bảo vệ thông tin tài khoản.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mật khẩu hiện tại</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="password" name="oldPassword" value={form.oldPassword} onChange={handleChange} required placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mật khẩu mới</label>
            <div className="relative">
              <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} required placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Xác nhận mật khẩu</label>
            <div className="relative">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold" />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full mt-4 h-11 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-600/10 disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[9px] font-bold text-slate-300 uppercase tracking-widest text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-300" /> Hệ thống bảo mật thông tin tuyệt đối
        </div>
      </motion.div>
    </div>
  );
}