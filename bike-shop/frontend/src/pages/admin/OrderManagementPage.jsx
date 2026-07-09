// src/pages/admin/OrderManagementPage.jsx
// Senior UI/UX Redesign - High-End Stripe Style Order Fulfillment Control
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Filter, 
  Download, 
  Calendar, 
  Eye, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  FileText, 
  X, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertCircle 
} from "lucide-react";
import orderService from "../../services/orderService";
import { formatVND, resolveImageUrl } from "../../components/ProductCard";
import Loader from "../../components/Loader";

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200/60",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200/60",
  SHIPPING: "bg-purple-50 text-purple-700 border-purple-200/60",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200/40",
};

const statusDotColors = {
  PENDING: "bg-amber-500",
  CONFIRMED: "bg-blue-500",
  SHIPPING: "bg-purple-500",
  COMPLETED: "bg-emerald-500",
  CANCELLED: "bg-rose-500",
};

const statusLabels = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao hàng",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy đơn",
};

const statusOptions = Object.keys(statusLabels);

export default function OrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  
  // 🎯 UI/UX Cải tiến: Sử dụng Detail Drawer trượt cao cấp thay thế cho expanded accordion cũ
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAll();
      setOrders(res.data || []);
    } catch (err) {
      toast.error("Không thể lấy danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await orderService.updateStatus(id, { status });
      toast.success("Đã cập nhật trạng thái đơn hàng");
      
      // Đồng bộ trực tiếp dữ liệu lên Drawer nếu đang mở xem chi tiết đơn đó
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(prev => ({ ...prev, status }));
      }
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể cập nhật trạng thái");
    }
  };

  // Giả lập tính năng Export CSV/Excel xuất báo cáo doanh số cho Admin
  const handleExportData = () => {
    toast.info("Hệ thống đang tổng hợp dữ liệu đơn hàng và xuất file CSV...");
  };

  // Tích hợp chuỗi tìm kiếm theo tên hoặc mã đơn kèm lọc trạng thái bộ nguồn
  const filteredOrders = orders
    .filter((o) => (filterStatus ? o.status === filterStatus : true))
    .filter((o) => {
      const matchText = searchQuery.toLowerCase();
      return (
        o.id.toString().includes(matchText) ||
        o.userFullname.toLowerCase().includes(matchText) ||
        (o.receiverName && o.receiverName.toLowerCase().includes(matchText))
      );
    });

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 font-sans text-slate-900 relative">
      
      {/* 🎯 1. PREMIUM HEADER CONTROL ZONE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Quản lý luồng đơn hàng</h1>
          <p className="text-xs text-slate-400 mt-1">Theo dõi hành trình mua sắm, kiểm duyệt vận đơn và xử lý trạng thái tài chính.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExportData}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xs transition self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" /> Xuất báo cáo đơn hàng
        </motion.button>
      </div>

      {/* 🎯 2. INTERACTIVE CONTROLS BAR (Search & Status Filter Split) */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 border border-slate-200/60 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div className="relative flex-1">
          <input 
            type="text"
            placeholder="Tìm theo mã đơn (#101), tên khách hàng, điện thoại nhận hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-4 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
          />
        </div>
        <div className="relative inline-flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent border-none text-xs text-slate-600 focus:outline-none pr-6 py-2 cursor-pointer appearance-none font-semibold"
          >
            <option value="">Tất cả trạng thái xử lý</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 🎯 3. MAIN ORDERS GRID LIST (Stripe Minimalist List Blueprint) */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-16 text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-sm">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy vận đơn</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">Hệ thống chưa ghi nhận hóa đơn giao dịch nào khớp với tiêu chí phân lọc.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50/70 border-b border-slate-200/60 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Mã hóa đơn</th>
                  <th className="px-5 py-3.5">Khách hàng</th>
                  <th className="px-5 py-3.5">Thời gian khởi tạo</th>
                  <th className="px-5 py-3.5">Tổng giá trị đơn</th>
                  <th className="px-5 py-3.5">Trạng thái vận hành</th>
                  <th className="px-5 py-3.5 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/40 transition duration-150 group">
                    <td className="px-5 py-4 font-bold text-slate-900">#{order.id}</td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{order.receiverName || order.userFullname}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{order.receiverPhone || "Không có điện thoại"}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-400 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.orderDate).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-black text-slate-900">{formatVND(order.totalPrice)}</td>
                    <td className="px-5 py-4">
                      {/* 🎯 STATUS BADGE SPECIFICATION */}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${statusStyles[order.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDotColors[order.status]} animate-pulse`} />
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition inline-flex items-center"
                        title="Xem chi tiết vận đơn"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🎯 4. PREMIUM COMPREHENSIVE DETAIL DRAWER CONTROL */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            {/* Lớp nền mờ che phủ không gian chính */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50"
            />
            
            {/* Thùng kéo Drawer đẩy từ cạnh phải */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-slate-200 h-screen z-50 shadow-2xl flex flex-col font-sans"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">Chi tiết vận đơn #{selectedOrder.id}</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Khởi tạo bởi hệ thống tài khoản khách hàng</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body Area (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar text-xs">
                
                {/* 🎯 TIMELINE LOGISTICS STATUS MAP */}
                <div className="bg-slate-50 p-4 border border-slate-200/60 rounded-xl">
                  <p className="font-bold text-slate-800 mb-3.5 uppercase tracking-wider text-[10px] text-slate-400">Tiến trình vận đơn</p>
                  <div className="relative border-l border-slate-200 pl-4 ml-2 space-y-4">
                    <div className="relative">
                      <span className="absolute -left-[21px] top-0.5 bg-emerald-500 text-white p-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" /></span>
                      <p className="font-bold text-slate-900 text-xs">Đơn hàng được tiếp nhận</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">Khách hàng hoàn tất thanh toán giỏ hàng</p>
                    </div>
                    <div className="relative">
                      <span className={`absolute -left-[21px] top-0.5 p-0.5 rounded-full ${["CONFIRMED", "SHIPPING", "COMPLETED"].includes(selectedOrder.status) ? "bg-blue-500 text-white" : "bg-slate-100 border border-slate-200 text-slate-400"}`}><Clock className="w-3 h-3" /></span>
                      <p className={`font-bold text-xs ${["CONFIRMED", "SHIPPING", "COMPLETED"].includes(selectedOrder.status) ? "text-slate-900" : "text-slate-400"}`}>Quản trị viên xác nhận</p>
                    </div>
                    <div className="relative">
                      <span className={`absolute -left-[21px] top-0.5 p-0.5 rounded-full ${["SHIPPING", "COMPLETED"].includes(selectedOrder.status) ? "bg-purple-500 text-white" : "bg-slate-100 border border-slate-200 text-slate-400"}`}><Truck className="w-3 h-3" /></span>
                      <p className={`font-bold text-xs ${["SHIPPING", "COMPLETED"].includes(selectedOrder.status) ? "text-slate-900" : "text-slate-400"}`}>Bàn giao đơn vị vận chuyển</p>
                    </div>
                    <div className="relative">
                      <span className={`absolute -left-[21px] top-0.5 p-0.5 rounded-full ${selectedOrder.status === "COMPLETED" ? "bg-emerald-500 text-white" : selectedOrder.status === "CANCELLED" ? "bg-rose-500 text-white" : "bg-slate-100 border border-slate-200 text-slate-400"}`}>{selectedOrder.status === "CANCELLED" ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}</span>
                      <p className={`font-bold text-xs ${selectedOrder.status === "COMPLETED" ? "text-emerald-700" : selectedOrder.status === "CANCELLED" ? "text-rose-700" : "text-slate-400"}`}>
                        {selectedOrder.status === "CANCELLED" ? "Đã hủy bỏ giao dịch" : "Giao xe hoàn tất thành công"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* THÔNG TIN KHÁCH HÀNG NHẬN HÀNG */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Thông tin bàn giao</h3>
                  <div className="bg-white border border-slate-100 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
                    <div className="flex items-center gap-2.5 text-slate-600 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-900 font-bold">{selectedOrder.receiverName || selectedOrder.userFullname}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-600 font-medium">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedOrder.receiverPhone || "Chưa cung cấp số điện thoại"}</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-slate-600 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                      <span className="flex-1 leading-relaxed text-slate-900">{selectedOrder.shippingAddress}</span>
                    </div>
                  </div>
                </div>

                {/* THÔNG TIN TÀI CHÍNH & PHƯƠNG THỨC */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Cơ chế thanh toán</h3>
                  <div className="bg-white border border-slate-100 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
                    <div className="flex items-center gap-2.5 text-slate-600 font-medium">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">{selectedOrder.paymentMethod}</span>
                    </div>
                    {selectedOrder.note && (
                      <div className="flex items-start gap-2.5 text-slate-600 font-medium border-t border-slate-100 pt-2.5 mt-2.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                        <span className="flex-1 italic text-slate-500">“ {selectedOrder.note} ”</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* DANH SÁCH THIẾT BỊ XE ĐẠP TRONG ĐƠN HÀNG */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Giỏ hàng đặt mua</h3>
                  <div className="divide-y divide-slate-100 bg-white border border-slate-100 rounded-xl px-3.5 shadow-2xs">
                    {selectedOrder.orderDetails?.map((d) => (
                      <div key={d.id} className="flex items-center gap-3.5 py-3 first:pt-3.5 last:pb-3.5 group">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                          <img
                            src={resolveImageUrl(d.productImage) || "https://placehold.co/60x60?text=Bike"}
                            alt=""
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{d.productName}</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Số lượng: x{d.quantity}</p>
                        </div>
                        <p className="font-black text-slate-900 shrink-0">{formatVND(d.price * d.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Drawer Footer CONTROL ACTION ZONE */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
                <span className="text-sm font-black text-slate-900">Tổng: {formatVND(selectedOrder.totalPrice)}</span>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái:</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-blue-600 cursor-pointer shadow-2xs"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{statusLabels[s]}</option>
                    ))}
                  </select>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}