// src/pages/ProfilePage.jsx
// Senior UI/UX Redesign - Profile & Security Settings
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Save, ShieldCheck, Key, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import userService from "../services/userService";
import { setCredentials } from "../context/authSlice";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ ...user });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Lưu ý: nếu đã sửa backend thành /api/users/me, hãy đổi thành userService.updateMe(form)
      await userService.update(user.id, form);
      dispatch(setCredentials({ user: form, token: localStorage.getItem("token") }));
      toast.success("Hồ sơ đã được cập nhật!");
    } catch (err) {
      toast.error("Không thể cập nhật hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Cấu hình cá nhân</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Quản lý thông tin và bảo mật tài khoản của bạn.</p>
      </div>

      <div className="space-y-6">
        {/* Form Thông tin */}
        <motion.form 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] space-y-5"
        >
          <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold uppercase text-xs">
            <User className="w-4 h-4" /> Thông tin cơ bản
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Họ và tên</label>
              <input name="fullname" value={form.fullname} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 mt-1 text-xs font-semibold focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Email (Không thể sửa)</label>
              <input disabled value={form.email} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 mt-1 text-xs font-semibold cursor-not-allowed text-slate-500" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Số điện thoại</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 mt-1 text-xs font-semibold focus:border-blue-600 outline-none" />
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Địa chỉ giao hàng</label>
            <textarea name="address" value={form.address} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 mt-1 text-xs font-semibold focus:border-blue-600 outline-none" rows={2} />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-black text-xs uppercase px-6 py-3 rounded-xl hover:bg-black transition flex items-center justify-center gap-2">
            <Save className="w-3.5 h-3.5" /> {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </motion.form>

        {/* Khu vực bảo mật */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase">Mật khẩu</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Cập nhật mật khẩu để giữ tài khoản an toàn.</p>
            </div>
          </div>
          <Link to="/change-password" className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1 hover:underline">
            Thay đổi <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}