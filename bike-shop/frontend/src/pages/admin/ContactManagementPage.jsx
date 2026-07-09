// src/pages/admin/ContactManagementPage.jsx
// Senior UI/UX Redesign - Premium Gmail Inbox Core Layout Specification
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  MailOpen, 
  Search, 
  Trash2, 
  CheckCircle2, 
  User, 
  Phone, 
  Clock, 
  X, 
  AlertTriangle,
  Inbox,
  ArrowRight,
  Filter
} from "lucide-react";
import contactService from "../../services/contactService";
import Loader from "../../components/Loader";

export default function ContactManagementPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🎯 UI/UX Cải tiến: Drawer chi tiết chuẩn hóa Gmail & tìm kiếm cục bộ nâng cao
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL"); // ALL, UNREAD, PROCESSED
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const res = await contactService.getAll();
      setContacts(res.data || []);
    } catch (err) {
      toast.error("Không thể tải danh sách liên hệ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleMarkProcessed = async (id) => {
    try {
      await contactService.markProcessed(id);
      toast.success("Đã đánh dấu đã xử lý yêu cầu");
      
      // Cập nhật trạng thái tức thì trên Drawer nếu đang mở xem
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact(prev => ({ ...prev, status: "PROCESSED" }));
      }
      loadContacts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const triggerDeleteConfirm = (id) => {
    setDeleteTargetId(id);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await contactService.delete(deleteTargetId);
      toast.success("Đã xóa thư liên hệ khỏi hệ thống");
      if (selectedContact && selectedContact.id === deleteTargetId) {
        setSelectedContact(null);
      }
      setDeleteTargetId(null);
      loadContacts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa liên hệ");
    } finally {
      setDeleteTargetId(null);
    }
  };

  // Hệ thống lọc phân tầng dữ liệu theo chuẩn Inbox
  const processedFilteredContacts = contacts.filter((c) => {
    if (filterType === "UNREAD") return c.status !== "PROCESSED";
    if (filterType === "PROCESSED") return c.status === "PROCESSED";
    return true;
  });

  // Bộ lọc gõ text tìm kiếm tức thì Client-side
  const finalFilteredContacts = processedFilteredContacts.filter((c) => {
    const text = searchQuery.toLowerCase();
    return (
      c.fullname.toLowerCase().includes(text) ||
      c.email.toLowerCase().includes(text) ||
      (c.phone && c.phone.includes(text)) ||
      (c.message && c.message.toLowerCase().includes(text))
    );
  });

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 font-sans text-slate-900 relative">
      
      {/* 🎯 1. PREMIUM HEADER CONTROL ZONE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Hộp thư liên hệ</h1>
          <p className="text-xs text-slate-400 mt-1">Tiếp nhận và phản hồi thông tin góp ý, hỗ trợ kỹ thuật và tư vấn từ khách hàng.</p>
        </div>
      </div>

      {/* 🎯 2. INBOX CONTROLS BAR (Gmail split actions) */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-3 border border-slate-200/60 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        {/* Bộ nút phân loại tab giống như cấu trúc Inbox của Gmail */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/30 gap-1 shrink-0">
          <button
            onClick={() => setFilterType("ALL")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${filterType === "ALL" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-400 hover:text-slate-600"}`}
          >
            Tất cả ({contacts.length})
          </button>
          <button
            onClick={() => setFilterType("UNREAD")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${filterType === "UNREAD" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-400 hover:text-slate-600"}`}
          >
            Chưa xử lý ({contacts.filter(c => c.status !== "PROCESSED").length})
          </button>
          <button
            onClick={() => setFilterType("PROCESSED")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${filterType === "PROCESSED" ? "bg-white text-emerald-600 shadow-2xs" : "text-slate-400 hover:text-slate-600"}`}
          >
            Đã xử lý
          </button>
        </div>

        {/* Thanh tìm kiếm nhanh nội dung thư */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Tìm theo tên khách hàng, email, số điện thoại hoặc từ khóa tin nhắn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
          />
        </div>
      </div>

      {/* 🎯 3. GMAIL-STYLE LIST FEEDTABLE & EMPTY STATE */}
      {finalFilteredContacts.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-16 text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-sm">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Hộp thư trống</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">Không tìm thấy yêu cầu liên hệ nào khớp với điều kiện lọc hiện tại.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="divide-y divide-slate-100 flex flex-col">
            {finalFilteredContacts.map((c, idx) => {
              const isUnread = c.status !== "PROCESSED";
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  onClick={() => setSelectedContact(c)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 cursor-pointer border-l-2 transition-all duration-150 ${
                    isUnread 
                      ? "border-l-blue-500 bg-blue-50/15 hover:bg-blue-50/30" 
                      : "border-l-transparent hover:bg-slate-50/60"
                  }`}
                >
                  {/* Cột trái: Tên người gửi & Biểu tượng chỉ định trạng thái Unread */}
                  <div className="flex items-center gap-3.5 sm:w-1/4 shrink-0">
                    <div className={isUnread ? "text-blue-500" : "text-slate-300"}>
                      {isUnread ? <Mail className="w-4 h-4 fill-blue-50" /> : <MailOpen className="w-4 h-4" />}
                    </div>
                    <span className={`text-xs truncate ${isUnread ? "font-extrabold text-slate-900" : "font-semibold text-slate-600"}`}>
                      {c.fullname}
                    </span>
                  </div>

                  {/* Cột giữa: Trích đoạn tin nhắn rút gọn */}
                  <div className="flex-1 min-w-0 sm:px-2">
                    <p className={`text-xs truncate ${isUnread ? "font-bold text-slate-800" : "font-medium text-slate-400"}`}>
                      <span className="text-slate-400 font-medium mr-1">[{c.email}]</span> 
                      {c.message}
                    </p>
                  </div>

                  {/* Cột phải: Badge trạng thái & Thời gian khởi tạo */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 border-slate-50 pt-2 sm:pt-0">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                      !isUnread 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" 
                        : "bg-amber-50 text-amber-700 border-amber-200/60"
                    }`}>
                      {!isUnread ? "Đã xử lý" : "Mới"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 🎯 4. INBOX DETAIL DRAWER CONTROL */}
      <AnimatePresence>
        {selectedContact && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedContact(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50"
            />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-white border-l border-slate-200 h-screen z-50 shadow-2xl flex flex-col font-sans"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900">Chi tiết thư yêu cầu</h2>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">ID: #{selectedContact.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedContact(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar text-xs">
                
                {/* THÔNG TIN NGƯỜI GỬI SƠ ĐỒ PROFILE */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Danh tính người gửi</h3>
                  <div className="bg-slate-50/60 border border-slate-200/60 rounded-xl p-4 space-y-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-600 text-white font-bold text-sm rounded-full flex items-center justify-center shadow-xs">
                        {selectedContact.fullname.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{selectedContact.fullname}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{selectedContact.email}</p>
                      </div>
                    </div>
                    {selectedContact.phone && (
                      <div className="flex items-center gap-2 text-slate-600 font-medium pl-12 border-t border-slate-100/60 pt-2.5 mt-1 text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>Điện thoại: <span className="text-slate-900 font-bold">{selectedContact.phone}</span></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* NỘI DUNG CHI TIẾT TIN NHẮN */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Nội dung thư liên hệ</h3>
                  <div className="bg-white border border-slate-200/50 rounded-xl p-4 shadow-2xs relative">
                    <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                      {selectedContact.message}
                    </p>
                    <div className="border-t border-slate-50 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Thời gian gửi:</span>
                      <span>{new Date(selectedContact.createdAt).toLocaleString("vi-VN")}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Drawer Footer ACTION ZONE */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => triggerDeleteConfirm(selectedContact.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 border border-slate-200 hover:border-red-600 bg-white px-4 py-2 rounded-xl transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Gỡ bỏ thư
                </button>
                {selectedContact.status !== "PROCESSED" && (
                  <button
                    type="button"
                    onClick={() => handleMarkProcessed(selectedContact.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-md shadow-blue-600/10 transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đánh dấu đã xử lý
                  </button>
                )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 🎯 5. PREMIUM SHADCN/UI STYLE DELETE MODAL */}
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
              <h3 className="text-sm font-bold text-slate-900">Xác nhận xóa thư liên hệ?</h3>
              <p className="text-xs text-slate-400 mt-1 px-2 leading-relaxed">
                Hành động này sẽ gỡ thư vĩnh viễn khỏi hàng đợi lưu trữ và bảng điều khiển tổng quan hệ thống.
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