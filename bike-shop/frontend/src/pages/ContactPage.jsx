// src/pages/ContactPage.jsx
// Senior UI/UX Redesign - Premium Contact & Support Matrix (shadcn/ui style)
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  HelpCircle,
  User,
  Smartphone
} from "lucide-react";
import contactService from "../services/contactService";

const emptyForm = { fullname: "", email: "", phone: "", message: "" };

export default function ContactPage() {
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactService.submit(form);
      toast.success("Thông tin liên hệ đã được gửi tới đội ngũ BikeShop!");
      setSubmitted(true);
      setForm(emptyForm);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể gửi liên hệ, vui lòng thử lại sau");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-8 py-12 font-sans text-slate-900">
      
      {/* 🎯 1. HEADER ZONE */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight mb-3">Liên hệ hỗ trợ</h1>
        <p className="text-xs md:text-sm text-slate-400 font-medium">
          Mọi thắc mắc về kỹ thuật xe, chính sách bảo hành hoặc tiến độ đơn hàng sẽ được đội ngũ chuyên gia của BikeShop giải đáp trực tiếp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        
        {/* 🎯 2. CONTACT FORM MATRIX */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} 
          className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Họ và tên</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Địa chỉ Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Số điện thoại liên hệ</label>
            <div className="relative">
              <Smartphone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nội dung yêu cầu</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Vui lòng mô tả chi tiết yêu cầu hỗ trợ của bạn..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold custom-scrollbar"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-300 shadow-md shadow-blue-600/10 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? "Đang gửi nội dung..." : <>Gửi liên hệ <Send className="w-4 h-4" /></>}
          </button>

          <AnimatePresence>
            {submitted && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-xs font-bold"
              >
                <CheckCircle2 className="w-4 h-4" /> Cảm ơn! Chúng tôi đã nhận được thông tin.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

        {/* 🎯 3. INFO SIDEBAR MATRIX */}
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">Thông tin điều hành</h3>
            <div className="space-y-3 text-[11px] font-bold text-slate-600">
              <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-blue-600" /> Đường số 18, Linh Xuân, TP.HCM</p>
              <p className="flex items-center gap-3"><Smartphone className="w-4 h-4 text-blue-600" /> 0389 820 547</p>
              <p className="flex items-center gap-3"><Mail className="w-4 h-4 text-blue-600" /> lethanhho.hb2005@gmail.com</p>
              <p className="flex items-center gap-3"><Clock className="w-4 h-4 text-blue-600" /> 8:00 - 21:00, tất cả các ngày</p>
            </div>
          </div>
          
          <div className="bg-blue-600 text-white rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20"><HelpCircle className="w-20 h-20" /></div>
            <h3 className="font-black text-sm uppercase tracking-wider mb-2 relative z-10">Bạn cần tư vấn gấp?</h3>
            <p className="text-[10px] font-medium opacity-90 leading-relaxed relative z-10">
              Sử dụng khung chat trợ lý ở góc phải màn hình để được kỹ thuật viên hỗ trợ giải đáp tức thì về giá cả và thông số kỹ thuật.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}