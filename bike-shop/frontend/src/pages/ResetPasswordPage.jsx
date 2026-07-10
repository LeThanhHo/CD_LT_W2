// src/pages/ResetPasswordPage.jsx
// Senior UI/UX Redesign - Secure Password Reset Portal
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, ArrowRight, AlertTriangle } from "lucide-react";
import authService from "../services/authService";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Liên kết khôi phục đã hết hạn hoặc không hợp lệ");
      return;
    }
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
      const res = await authService.resetPassword(token, form.newPassword);
      toast.success(res.data.message || "Đã thiết lập lại mật khẩu thành công");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể thực thi lệnh thay đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-xs">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <p className="text-sm text-slate-500 mb-6 font-medium">Liên kết xác thực phiên làm việc này không còn hiệu lực.</p>
          <Link to="/forgot-password" className="inline-block bg-slate-900 text-white text-xs font-bold uppercase py-3 px-6 rounded-xl hover:bg-black transition">
            Yêu cầu liên kết mới
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16 bg-slate-50/50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm bg-white border border-slate-200/80 rounded-3xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">Mật khẩu mới</h1>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">Thiết lập khóa bảo mật mới cho tài khoản của bạn.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mật khẩu mới</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} 
                required placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold" />
            </div>
          </div>
          
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Xác nhận mật khẩu</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} 
                required placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold" />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full mt-4 h-11 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-600/10 disabled:opacity-60"
          >
            {loading ? "Đang cập nhật..." : "Xác nhận đổi mật khẩu"}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-[11px] font-black text-slate-400 hover:text-blue-600 transition inline-flex items-center gap-1 uppercase tracking-wider">
            Quay lại đăng nhập <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}