// src/pages/admin/BrandManagementPage.jsx
// Senior UI/UX Redesign - Luxury Minimalist Brand Engine
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Bike, 
  Edit2, 
  Trash2, 
  Search, 
  AlertTriangle, 
  X, 
  ImagePlus, 
  UploadCloud 
} from "lucide-react";
import brandService from "../../services/brandService";
import uploadService from "../../services/uploadService";
import { resolveImageUrl } from "../../components/ProductCard";
import Loader from "../../components/Loader";

const emptyForm = { name: "", logo: "" };

export default function BrandManagementPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // State phụ trợ tối ưu vi tương tác tìm kiếm và bẫy lỗi Delete Modal
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const res = await brandService.getAll();
      setBrands(res.data || []);
    } catch (err) {
      toast.error("Không thể tải danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (b) => {
    setEditingId(b.id);
    setForm({ name: b.name, logo: b.logo || "" });
    setShowModal(true);
  };

  const handleLogoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      setForm((prev) => ({ ...prev, logo: res.data.url }));
      toast.success("Đã tải logo lên thành công");
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể tải logo lên");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await brandService.update(editingId, form);
        toast.success("Đã cập nhật hãng xe đối tác");
      } else {
        await brandService.create(form);
        toast.success("Đã thêm đối tác sản xuất mới");
      }
      setShowModal(false);
      loadBrands();
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi lưu");
    } finally {
      setSaving(false);
    }
  };

  const triggerDeleteConfirm = (id) => {
    setDeleteTargetId(id);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await brandService.delete(deleteTargetId);
      toast.success("Đã gỡ nhà sản xuất khỏi hệ thống");
      setDeleteTargetId(null);
      loadBrands();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa hãng xe (Hãng đang liên kết với các mẫu xe trong kho)");
    } finally {
      setDeleteTargetId(null);
    }
  };

  // Bộ lọc từ khóa client-side đồng bộ kiến trúc
  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* 🎯 1. HEADER CONTROL ZONE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Hãng đối tác & Nhà sản xuất</h1>
          <p className="text-xs text-slate-400 mt-1">Cấu hình thông tin danh danh tính nhà phân phối, logo hiển thị bộ lọc thương hiệu.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/10 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Thêm nhà sản xuất mới
        </motion.button>
      </div>

      {/* 🎯 2. INTERACTIVE SEARCH BAR */}
      <div className="flex bg-white p-3 border border-slate-200/60 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Tìm kiếm nhanh tên hãng xe, nhãn hiệu linh kiện đối tác..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
          />
        </div>
      </div>

      {/* 🎯 3. MAIN LOGO TABLE & EMPTY STATE */}
      {loading ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-16 flex justify-center shadow-sm"><Loader /></div>
      ) : filteredBrands.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-16 text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-sm">
            <Bike className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy nhãn hiệu phù hợp</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">Hệ thống chưa ghi nhận nhà phân phối nào trùng khớp với thông tin tìm kiếm.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50/70 border-b border-slate-200/60 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 w-1/4">Nhận diện Thương hiệu</th>
                  <th className="px-5 py-3.5 w-1/2">Tên nhà cung cấp / Hãng xe</th>
                  <th className="px-5 py-3.5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredBrands.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition duration-150 group">
                    <td className="px-5 py-4">
                      <div className="w-14 h-10 bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-2xs flex items-center justify-center p-1.5 transition-transform group-hover:scale-105">
                        <img
                          src={resolveImageUrl(b.logo) || "https://placehold.co/40x40?text=Logo"}
                          alt=""
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">{b.name}</span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                      <button 
                        onClick={() => openEdit(b)} 
                        className="p-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition inline-flex items-center"
                        title="Sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => triggerDeleteConfirm(b.id)} 
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
                  <ImagePlus className="w-4 h-4 text-blue-600" />
                  {editingId ? "Cấu hình nhãn hiệu" : "Liên kết đối tác sản xuất mới"}
                </h2>
                <button className="text-slate-400 hover:text-slate-600 p-1" onClick={() => setShowModal(false)}><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 font-medium text-slate-700">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tên hãng thương mại</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="Ví dụ: Giant, Specialized, Trek, Shimano..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nhận diện Logo</label>
                  <div className="flex items-center gap-4 p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                    <div className="w-16 h-16 rounded-xl border border-slate-200/80 bg-white overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-sm">
                      {form.logo ? (
                        <img src={resolveImageUrl(form.logo)} alt="" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">No Logo</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-bold hover:bg-slate-50 cursor-pointer shadow-sm transition">
                        <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                        {uploading ? "Đang đẩy ảnh..." : "Chọn tệp ảnh logo"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoSelect}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">Hỗ trợ định dạng PNG nền trong suốt.</p>
                    </div>
                  </div>
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
                    disabled={saving || uploading}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition disabled:opacity-60 shadow-md shadow-blue-600/10"
                  >
                    {saving ? "Hệ thống đang lưu..." : "Lưu dữ liệu"}
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
              <h3 className="text-sm font-bold text-slate-900">Xác nhận hủy liên kết đối tác?</h3>
              <p className="text-xs text-slate-400 mt-1 px-2 leading-relaxed">
                Hệ thống sẽ từ chối xóa nếu hãng xe này đang được gán quyền sở hữu cho các dòng xe đang lưu kho.
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