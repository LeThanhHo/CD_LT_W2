// src/pages/admin/CategoryManagementPage.jsx
// Senior UI/UX Redesign - shadcn/ui Spec Alignment
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  FolderTree, 
  Edit2, 
  Trash2, 
  Search, 
  AlertTriangle, 
  X, 
  FileText 
} from "lucide-react";
import categoryService from "../../services/categoryService";
import Loader from "../../components/Loader";

const emptyForm = { name: "", description: "" };

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // State phụ phục vụ tìm kiếm nhanh cục bộ và quản lý Delete Modal cao cấp
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll();
      setCategories(res.data || []);
    } catch (err) {
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({ name: c.name, description: c.description || "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await categoryService.update(editingId, form);
        toast.success("Đã cập nhật cấu trúc danh mục");
      } else {
        await categoryService.create(form);
        toast.success("Đã thêm danh mục mới thành công");
      }
      setShowModal(false);
      loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi lưu");
    } finally {
      setSaving(false);
    }
  };

  // Mở modal xác nhận xóa thay cho alert confirm của hệ thống cũ
  const triggerDeleteConfirm = (id) => {
    setDeleteTargetId(id);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await categoryService.delete(deleteTargetId);
      toast.success("Đã xóa danh mục hệ thống");
      setDeleteTargetId(null);
      loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa danh mục (Danh mục đang liên kết với sản phẩm)");
    } finally {
      setDeleteTargetId(null);
    }
  };

  // Bộ lọc từ khóa client-side gia tăng vi tương tác
  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* 🎯 1. HEADER CONTROL ZONE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Danh mục xe đạp</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý cấu trúc phân loại sản phẩm xe, hỗ trợ phân tách bộ lọc trang chủ.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/10 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Thêm danh mục mới
        </motion.button>
      </div>

      {/* 🎯 2. INTERACTIVE SEARCH BAR (Đồng bộ với trang sản phẩm) */}
      <div className="flex bg-white p-3 border border-slate-200/60 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Tìm kiếm nhanh tên phân loại, mô tả danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
          />
        </div>
      </div>

      {/* 🎯 3. MAIN TABLE & EMPTY STATE ZONE */}
      {loading ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-16 flex justify-center shadow-sm"><Loader /></div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-16 text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-sm">
            <FolderTree className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy danh mục phù hợp</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">Hệ thống chưa có phân loại nào khớp với từ khóa tìm kiếm của bạn.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50/70 border-b border-slate-200/60 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 w-1/3">Tên danh mục</th>
                  <th className="px-5 py-3.5 w-1/2">Mô tả chi tiết</th>
                  <th className="px-5 py-3.5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredCategories.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition duration-150 group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                          <FolderTree className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 max-w-md truncate">{c.description || <span className="text-slate-300 italic">Chưa có thông tin mô tả</span>}</td>
                    <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                      <button 
                        onClick={() => openEdit(c)} 
                        className="p-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition inline-flex items-center"
                        title="Sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => triggerDeleteConfirm(c.id)} 
                        className="p-1.5 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded-lg text-slate-400 hover:text-red-600 transition inline-flex items-center"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🎯 4. HIGH-END FORM MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 p-4 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setShowModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 border border-slate-200/60"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  {editingId ? "Cấu hình danh mục" : "Tạo phân loại danh mục mới"}
                </h2>
                <button className="text-slate-400 hover:text-slate-600 p-1" onClick={() => setShowModal(false)}><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 font-medium text-slate-700">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tên danh mục phân loại</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="Ví dụ: Xe đạp địa hình, Xe đua Road..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mô tả tóm tắt</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    placeholder="Nhập nội dung ghi chú định hướng cho danh mục này..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition disabled:opacity-60 shadow-md shadow-blue-600/10"
                  >
                    {saving ? "Hệ thống đang lưu..." : "Lưu danh mục"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
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
              <h3 className="text-sm font-bold text-slate-900">Xác nhận xóa danh mục?</h3>
              <p className="text-xs text-slate-400 mt-1 px-2 leading-relaxed">
                Hành động gỡ bỏ danh mục này sẽ thất bại hoặc gây lỗi nếu có sản phẩm trong kho đang thuộc phân loại này.
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