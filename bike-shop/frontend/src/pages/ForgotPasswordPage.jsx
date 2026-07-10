// src/pages/ForgotPasswordPage.jsx
// Senior UI/UX Redesign - Secure Password Recovery Portal
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import authService from "../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      toast.success(res.data.message || "Hướng dẫn khôi phục đã được gửi");
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 md:px-8 py-16 bg-slate-50/50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm bg-white border border-slate-200/80 rounded-3xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-600">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">Khôi phục mật khẩu</h1>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">Hệ thống sẽ gửi liên kết xác thực về email bạn đã đăng ký.</p>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div 
              key="sent"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-4"
            >
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
                Yêu cầu thành công! Vui lòng kiểm tra hộp thư (cả mục Spam) để nhận liên kết đặt lại mật khẩu.
              </p>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit} 
              className="space-y-4"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Địa chỉ Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@email.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-600/10 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? "Đang gửi..." : <>Gửi yêu cầu <Send className="w-3.5 h-3.5" /></>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <Link to="/login" className="text-[11px] font-black text-slate-400 hover:text-blue-600 transition inline-flex items-center gap-1 uppercase tracking-wider">
            <ArrowLeft className="w-3 h-3" /> Quay lại đăng nhập
          </Link>
        </div>
      </motion.div>
    </div>
  );
}