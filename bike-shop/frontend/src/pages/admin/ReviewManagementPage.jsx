// src/pages/admin/ReviewManagementPage.jsx
// Senior UI/UX Redesign - High-End Customer Feedback Matrix (Zendesk & Intercom Style)
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  MessageSquare, 
  Trash2, 
  ThumbsUp, 
  Calendar, 
  CornerDownRight, 
  CornerUpLeft, 
  Bike, 
  User,
  AlertTriangle
} from "lucide-react";
import reviewService from "../../services/reviewService";
import { resolveImageUrl } from "../../components/ProductCard";
import Loader from "../../components/Loader";

export default function ReviewManagementPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  // State phụ trợ quản lý việc hiển thị bộ lọc rating và Delete Modal cao cấp
  const [filterRating, setFilterRating] = useState(0);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewService.getAllForAdmin();
      setReviews(res.data || []);
    } catch (err) {
      toast.error("Không thể tải danh sách phản hồi khách hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleReplyChange = (reviewId, value) => {
    setReplyDrafts((prev) => ({ ...prev, [reviewId]: value }));
  };

  const handleReplySubmit = async (reviewId) => {
    const reply = (replyDrafts[reviewId] ?? "").trim();
    if (!reply) {
      toast.error("Vui lòng nhập nội dung phản hồi");
      return;
    }
    setSubmittingId(reviewId);
    try {
      await reviewService.reply(reviewId, reply);
      toast.success("Đã gửi phản hồi chính thức cho khách hàng");
      setReplyDrafts(prev => ({ ...prev, [reviewId]: "" })); // Xóa trắng bản nháp khi thành công
      loadReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể gửi phản hồi");
    } finally {
      setSubmittingId(null);
    }
  };

  const triggerDeleteConfirm = (id) => {
    setDeleteTargetId(id);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await reviewService.delete(deleteTargetId);
      toast.success("Đã gỡ đánh giá khỏi hệ thống");
      setDeleteTargetId(null);
      loadReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa đánh giá");
    } finally {
      setDeleteTargetId(null);
    }
  };

  // Lọc nhanh rating trực tiếp tại giao diện Client-side tăng cường micro interaction
  const filteredReviews = filterRating 
    ? reviews.filter(r => r.rating === filterRating) 
    : reviews;

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* 🎯 1. PREMIUM HEADER CONTROL ZONE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Kiểm duyệt đánh giá</h1>
          <p className="text-xs text-slate-400 mt-1">Lắng nghe ý kiến phản hồi về sản phẩm xe đạp, giải đáp thắc mắc và quản lý danh tiếng thương hiệu.</p>
        </div>
        
        {/* Bộ lọc nhanh số sao tương tác */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200/60 rounded-xl shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lọc sao:</span>
          <select 
            value={filterRating} 
            onChange={(e) => setFilterRating(Number(e.target.value))}
            className="text-xs text-slate-600 font-bold focus:outline-none bg-transparent cursor-pointer"
          >
            <option value={0}>Tất cả số sao</option>
            <option value={5}>⭐⭐⭐⭐⭐ (5 sao)</option>
            <option value={4}>⭐⭐⭐⭐ (4 sao)</option>
            <option value={3}>⭐⭐⭐ (3 sao)</option>
            <option value={2}>⭐⭐ (2 sao)</option>
            <option value={1}>⭐ (1 sao)</option>
          </select>
        </div>
      </div>

      {/* 🎯 2. LIST FEEDS & EMPTY STATES SPECIFICATION */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-16 text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-sm">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Không có đánh giá phù hợp</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">Chưa ghi nhận đánh giá hoặc phản hồi nào từ khách hàng khớp với phân lọc này.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((r, idx) => (
            <motion.div 
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -2, shadow: "0 10px 25px rgba(0,0,0,0.02)" }}
              className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 transition-all duration-200 relative group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                
                {/* TRÁI: AVATAR KHÁCH HÀNG & THÔNG TIN SẢN PHẨM */}
                <div className="flex items-start gap-4">
                  {/* 🎯 AVATAR KHÁCH HÀNG GIẢ LẬP CAO CẤP */}
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full border border-slate-200/60 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0 shadow-2xs">
                    {r.userFullname ? r.userFullname.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm leading-none">{r.userFullname}</h3>
                    <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 py-0.5">
                      <Bike className="w-3.5 h-3.5 text-blue-500" />
                      Sản phẩm: <span className="font-bold text-slate-700 hover:text-blue-600 cursor-pointer transition-colors truncate">{r.productName}</span>
                    </p>
                    
                    {/* 🎯 RATING STARS SYSTEM SPECIFICATION */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="flex text-amber-400 gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < r.rating ? "fill-amber-400" : "text-slate-200"}`} 
                          />
                        ))}
                      </div>
                      {r.likeCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200/50 px-1.5 py-0.5 rounded-md">
                          <ThumbsUp className="w-2.5 h-2.5 text-blue-500" /> {r.likeCount} Hữu ích
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* PHẢI: THỜI GIAN VÀ HÀNH ĐỘNG XÓA NHANH */}
                <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 shrink-0 self-stretch sm:self-auto border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(r.createdAt).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                  <button
                    onClick={() => triggerDeleteConfirm(r.id)}
                    className="sm:opacity-0 group-hover:opacity-100 p-1.5 bg-slate-50 hover:bg-red-50 border border-slate-200 text-slate-400 hover:text-red-600 rounded-lg transition inline-flex items-center"
                    title="Gỡ đánh giá này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* NỘI DUNG NHẬN XÉT CỦA KHÁCH HÀNG */}
              <div className="mt-4 pl-0 sm:pl-14">
                <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  {r.comment}
                </p>
                
                {/* KHU VỰC THƯ VIỆN ẢNH FEEDBACK THỰC TẾ */}
                {r.images && r.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {r.images.map((img, i) => (
                      <div key={i} className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:scale-105 transition duration-200 cursor-zoom-in">
                        <img
                          src={resolveImageUrl(img)}
                          alt="Feedback"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 🎯 3. HIGH-END REPLY INTERFACE ZONE */}
                {r.reply ? (
                  <div className="bg-blue-50/40 border border-blue-100/60 rounded-xl p-4 mt-4 relative overflow-hidden group/reply">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl" />
                    <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <CornerDownRight className="w-3.5 h-3.5" /> Phản hồi chính thức từ cửa hàng
                    </p>
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed pl-4 border-l border-blue-200/80">{r.reply}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-4 bg-slate-50/80 border border-slate-200/60 rounded-xl p-2 focus-within:bg-white focus-within:border-blue-600 transition duration-200">
                    <div className="p-1.5 text-slate-400 shrink-0">
                      <CornerUpLeft className="w-4 h-4" />
                    </div>
                    <input
                      value={replyDrafts[r.id] ?? ""}
                      onChange={(e) => handleReplyChange(r.id, e.target.value)}
                      placeholder="Nhập nội dung phản hồi chính thức cho khách hàng..."
                      className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none py-1.5"
                    />
                    <button
                      onClick={() => handleReplySubmit(r.id)}
                      disabled={submittingId === r.id}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-[11px] font-bold px-4 py-2 rounded-lg transition shadow-sm shadow-blue-600/10 shrink-0"
                    >
                      {submittingId === r.id ? "Đang gửi..." : "Gửi trả lời"}
                    </button>
                  </div>
                )}
              </div>

            </motion.div>
          ))}
        </div>
      )}

      {/* 🎯 4. PREMIUM SHADCN/UI STYLE DELETE MODAL */}
      <AnimatePresence>
        {deleteTargetId && (
          <div className="fixed inset-0 z-50 p-4 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs" 
              onClick={() => setDeleteTargetId(null)} 
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
              <h3 className="text-sm font-bold text-slate-900">Xác nhận xóa đánh giá?</h3>
              <p className="text-xs text-slate-400 mt-1 px-2 leading-relaxed">
                Hành động này sẽ xóa vĩnh viễn nội dung nhận xét của khách hàng khỏi trang chi tiết sản phẩm ngoài website.
              </p>
              <div className="flex gap-2 w-full mt-5">
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(null)}
                  className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-500 rounded-xl transition"
                >
                  Hủy quay lại
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/10 transition"
                >
                  Xác nhận xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}