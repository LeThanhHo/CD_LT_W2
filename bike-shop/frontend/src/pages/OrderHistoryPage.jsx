// src/pages/OrderHistoryPage.jsx
// Senior UI/UX Redesign - Premium Client Order Ledger (Canyon & shadcn/ui Layout)
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Calendar, 
  ChevronDown, 
  User, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  MessageSquare, 
  XCircle, 
  AlertTriangle,
  History
} from "lucide-react";
import orderService from "../services/orderService";
import { formatVND, resolveImageUrl } from "../components/ProductCard";
import Loader from "../components/Loader";

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200/60",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200/60",
  SHIPPING: "bg-purple-50 text-purple-700 border-purple-200/60",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  CANCELLED: "bg-rose-50 text-red-600 border-rose-200/60",
};

const statusLabels = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao xe",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy đơn",
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  // Cải tiến UX: Sử dụng Custom Confirmation Modal thay thế window.confirm
  const [cancelTargetId, setCancelTargetId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getMyOrders();
      setOrders(res.data || []);
    } catch (err) {
      toast.error("Không thể kết nối lịch sử mua sắm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const executeCancelOrder = async () => {
    if (!cancelTargetId) return;
    try {
      await orderService.cancel(cancelTargetId);
      toast.success("Đã hủy vận đơn theo yêu cầu");
      setCancelTargetId(null);
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể hủy đơn hàng");
    } finally {
      setCancelTargetId(null);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-8 py-12 font-sans text-slate-900">
      
      {/* 🎯 1. PREMIUM HEADER ZONE */}
      <div className="mb-8 border-b border-slate-200/60 pb-5">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" /> Đơn hàng của tôi
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-1">Giám sát lộ trình bàn giao, quản lý hóa đơn và để lại phản hồi kiểm định xe.</p>
      </div>

      {/* 🎯 2. LIST INTERACTION & EMPTY STATE */}
      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200/60 rounded-3xl shadow-2xs">
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-400 mb-6 font-medium">Tài khoản chưa ghi nhận dữ liệu giao dịch nào.</p>
          <Link to="/products" className="inline-flex items-center bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition shadow-md">
            Khởi động mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            return (
              <div 
                key={order.id} 
                className={`bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition duration-200 ${isExpanded ? "border-slate-300 ring-4 ring-slate-50" : "hover:border-slate-300"}`}
              >
                {/* DÒNG TIÊU ĐỀ TỔNG QUAN ĐƠN HÀNG */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 text-left font-bold"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-slate-900 text-sm font-black">Kiện hàng mã #{order.id}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.orderDate).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 self-stretch sm:self-auto border-t sm:border-t-0 border-slate-50 pt-3 sm:pt-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${statusStyles[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-slate-900 tracking-tight">{formatVND(order.totalPrice)}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180 text-blue-600" : ""}`} />
                    </div>
                  </div>
                </button>

                {/* KHU VỰC THÔNG TIN SẢN PHẨM CHI TIẾT KHI MỞ RỘNG */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="border-t border-slate-100 bg-slate-50/40 overflow-hidden"
                    >
                      <div className="p-5 md:p-6 space-y-6">
                        
                        {/* Hồ sơ thông tin giao nhận dạng card */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-slate-200/50 rounded-xl p-4 shadow-3xs text-xs font-semibold text-slate-500">
                          <div className="space-y-1">
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1"><User className="w-3.5 h-3.5" /> Nhân dạng người nhận</p>
                            <p className="font-black text-slate-900 text-sm pt-0.5">{order.receiverName}</p>
                            <p className="text-slate-600 font-mono flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {order.receiverPhone}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Địa chỉ hạ bốc hàng</p>
                            <p className="font-bold text-slate-700 leading-relaxed pt-0.5">{order.shippingAddress}</p>
                          </div>
                        </div>

                        {/* Danh sách các sản phẩm xe đạp bên trong đơn hàng */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-1">Danh mục linh kiện thiết bị</p>
                          
                          <div className="divide-y divide-slate-100 bg-white border border-slate-200/50 rounded-xl overflow-hidden shadow-3xs">
                            {order.orderDetails.map((d) => (
                              <div key={d.id} className="flex items-center gap-4 p-4 font-bold text-xs text-slate-800">
                                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                                  <img
                                    src={resolveImageUrl(d.productImage) || "https://placehold.co/60x60?text=Bike"}
                                    alt=""
                                    className="max-w-full max-h-full object-contain"
                                  />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <Link
                                    to={`/products/${d.productId}`}
                                    className="text-slate-900 font-black truncate hover:text-blue-600 transition-colors block text-sm"
                                  >
                                    {d.productName}
                                  </Link>
                                  <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-wider">Số lượng: x{d.quantity}</p>
                                </div>
                                
                                <p className="text-sm font-black text-slate-900 shrink-0 w-28 text-right">
                                  {formatVND(d.price * d.quantity)}
                                </p>

                                {/* Nút điều hướng nộp đánh giá tức thì */}
                                {order.status === "COMPLETED" && (
                                  <Link
                                    to={`/products/${d.productId}#reviews`}
                                    className="text-[11px] font-black text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg transition shrink-0 uppercase tracking-wider inline-flex items-center gap-1"
                                  >
                                    <MessageSquare className="w-3 h-3" /> Đánh giá
                                  </Link>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Nút yêu cầu hủy đơn nếu đang chờ duyệt */}
                        {order.status === "PENDING" && (
                          <div className="pt-2 flex justify-start border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setCancelTargetId(order.id)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 border border-slate-200 hover:border-red-600 bg-white px-4 py-2 rounded-xl transition shadow-3xs uppercase tracking-wider"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Hủy vận đơn này
                            </button>
                          </div>
                        )}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* 🎯 3. CUSTOM SHADCN/UI STYLE CANCEL ORDER CONFIRMATION MODAL */}
      <AnimatePresence>
        {cancelTargetId && (
          <div className="fixed inset-0 z-50 p-4 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs" 
              onClick={() => setCancelTargetId(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl relative z-10 border border-slate-200/80 text-center flex flex-col items-center"
            >
              <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-full flex items-center justify-center text-red-500 mb-3.5 shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">Yêu cầu hủy đơn hàng?</h3>
              <p className="text-xs text-slate-400 mt-1 px-2 leading-relaxed font-sans font-medium">
                Hành động này sẽ gửi lệnh gỡ kiện hàng khỏi hệ thống điều phối vận chuyển của BikeShop. Bạn chắc chắn chứ?
              </p>
              <div className="flex gap-2 w-full mt-5 font-sans">
                <button
                  type="button"
                  onClick={() => setCancelTargetId(null)}
                  className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-500 rounded-xl transition"
                >
                  Giữ lại đơn
                </button>
                <button
                  type="button"
                  onClick={executeCancelOrder}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/10 transition"
                >
                  Xác nhận hủy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}