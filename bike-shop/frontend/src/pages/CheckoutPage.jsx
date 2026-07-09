// src/pages/CheckoutPage.jsx
// Senior UI/UX Redesign - Premium Stripe-style Billing & Checkout Matrix
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  CreditCard, 
  ShoppingBag, 
  ShieldCheck, 
  Lock,
  Wallet,
  Coins,
  Truck
} from "lucide-react";
import orderService from "../services/orderService";
import { fetchCart, clearCartState } from "../context/cartSlice";
import { formatVND, resolveImageUrl } from "../components/ProductCard";
import Loader from "../components/Loader";

const paymentMethods = [
  { value: "COD", label: "Thanh toán khi nhận hàng (COD)" },
  { value: "BANK_TRANSFER", label: "Chuyển khoản ngân hàng" },
  { value: "CREDIT_CARD", label: "Thẻ tín dụng / ghi nợ" },
  { value: "MOMO", label: "Ví điện tử MoMo" },
  { value: "VNPAY", label: "Cổng thanh toán VNPay" },
];

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, loading } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    receiverName: user?.fullname || "",
    receiverPhone: user?.phone || "",
    shippingAddress: user?.address || "",
    paymentMethod: "COD",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống");
      return;
    }
    setSubmitting(true);
    try {
      const res = await orderService.create(form);
      dispatch(clearCartState());
      toast.success("Đặt hàng thành công! Đang chuyển hướng...");
      navigate(`/orders`);
      void res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Đặt hàng thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 font-sans text-slate-900">
      
      {/* 🎯 1. HEADER ZONE */}
      <div className="mb-8 border-b border-slate-200/60 pb-5">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-600" /> Tiến hành thanh toán
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-1">Quy trình giao dịch được mã hóa bảo mật toàn vẹn dữ liệu đơn hàng.</p>
      </div>

      {/* FORM LƯỚI HAI CỘT PHÂN TẦNG */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
        
        {/* KHỐI TRÁI: THÔNG TIN GIAO NHẬN & PHƯƠNG THỨC CHI TRẢ */}
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" /> Thông tin nhận vận đơn
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Họ và tên người nhận</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    name="receiverName"
                    value={form.receiverName}
                    onChange={handleChange}
                    required
                    placeholder="Nhập tên người nhận kiện hàng..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Số điện thoại liên hệ</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    name="receiverPhone"
                    value={form.receiverPhone}
                    onChange={handleChange}
                    required
                    placeholder="Nhập số điện thoại nhận xe..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Địa chỉ bàn giao chính xác</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <textarea
                  name="shippingAddress"
                  value={form.shippingAddress}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, thành phố..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold custom-scrollbar"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ghi chú vận chuyển (Tùy chọn)</label>
              <div className="relative">
                <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Ví dụ: Giao ngoài giờ hành chính, gọi điện trước khi đến 15 phút..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold custom-scrollbar"
                />
              </div>
            </div>
          </div>

          {/* KHỐI PHƯƠNG THỨC THANH TOÁN DẠNG THẺ CAO CẤP */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" /> Cơ chế chi trả tài chính
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paymentMethods.map((pm) => {
                const isSelected = form.paymentMethod === pm.value;
                return (
                  <label
                    key={pm.value}
                    className={`flex items-center gap-3.5 border rounded-2xl px-4 py-3.5 cursor-pointer text-xs font-bold transition-all relative ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/20 text-blue-700 shadow-3xs"
                        : "border-slate-200 bg-slate-50/30 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.value}
                      checked={isSelected}
                      onChange={handleChange}
                      className="w-3.5 h-3.5 accent-blue-600 shrink-0 cursor-pointer"
                    />
                    <span className="truncate">{pm.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        {/* KHỐI PHẢI: TÓM TẮT GIỎ HÀNG KIỂM DUYỆT (STICKY SIDEBAR) */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 h-fit shadow-[0_4px_20px_rgba(0,0,0,0.01)] lg:sticky lg:top-24 space-y-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-blue-600" /> Tóm tắt giỏ hàng
          </h3>
          
          {/* Vùng danh sách sản phẩm cuộn nội bộ */}
          <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar border-b border-slate-100 pb-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-xs font-bold text-slate-800 group">
                <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                  <img
                    src={resolveImageUrl(item.productImage) || "https://placehold.co/60x60?text=Bike"}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 truncate leading-tight font-bold">{item.productName}</p>
                  <p className="text-[10px] text-slate-400 font-extrabold mt-0.5 uppercase tracking-wider">Số lượng: x{item.quantity}</p>
                </div>
                <p className="shrink-0 text-slate-900 font-black text-right">{formatVND(item.subTotal)}</p>
              </div>
            ))}
          </div>

          {/* Tổng cộng */}
          <div className="flex justify-between font-black text-slate-900 text-lg pt-1">
            <span>Tổng cộng</span>
            <span className="text-blue-600 tracking-tight">{formatVND(totalPrice)}</span>
          </div>

          <button
            type="submit"
            disabled={submitting || items.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-300 shadow-xl shadow-blue-600/10 active:scale-95 disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {submitting ? "Hệ thống đang xử lý..." : "Xác nhận đặt hàng"}
          </button>

          {/* Khối bảo mật dưới chân nút */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Kết nối mã hóa an toàn SSL
          </div>
        </div>

      </form>
    </div>
  );
}