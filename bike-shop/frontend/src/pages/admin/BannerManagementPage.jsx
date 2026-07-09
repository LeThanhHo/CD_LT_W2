// src/pages/admin/BannerManagementPage.jsx
// Senior UI/UX Redesign - Premium Dropzone & Banner Presentation (shadcn/ui layout)
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Image, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Link2, 
  Layers, 
  UploadCloud, 
  X, 
  AlertTriangle,
  MoveUp
} from "lucide-react";
import bannerService from "../../services/bannerService";
import uploadService from "../../services/uploadService";
import { resolveImageUrl } from "../../components/ProductCard";
import Loader from "../../components/Loader";

const emptyForm = { title: "", image: "", link: "", position: 1, status: "PUBLISHED" };

export default function BannerManagementPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // State phụ trợ tối ưu hóa UI/UX: Tìm kiếm, Kéo thả và Delete Modal cao cấp
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await bannerService.getAllAdmin();
      setBanners(res.data || []);
    } catch (err) {
      toast.error("Không thể tải danh sách banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBanners(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (b) => {
    setEditingId(b.id);
    setForm({ title: b.title, image: b.image, link: b.link || "", position: b.position, status: b.status });
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 🎯 CORE XỬ LÝ UPLOAD ẢNH (HỖ TRỢ CẢ CLICK LẪN KÉO THẢ DRAG & DROP)
  const processImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      setForm((prev) => ({ ...prev, image: res.data.url }));
      toast.success("Đã tải ảnh banner lên hệ thống thành công");
    } catch (err) {
      toast.error("Lỗi đồng bộ tải tập tin ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    processImageUpload(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await bannerService.update(editingId, form);
        toast.success("Cập nhật nội dung ưu đãi thành công");
      } else {
        await bannerService.create(form);
        toast.success("Xuất bản banner trang chủ mới thành công");
      }
      setShowModal(false);
      loadBanners();
    } catch (err) {
      toast.error("Có lỗi xảy ra trong quá trình ghi nhận");
    } finally { setSaving(false); }
  };

  const handleToggle = async (id) => {
    try {
      await bannerService.toggleVisibility(id);
      toast.success("Đã cập nhật trạng thái hiển thị");
      loadBanners();
    } catch (err) { toast.error("Không đổi được trạng thái"); }
  };

  const triggerDeleteConfirm = (id) => {
    setDeleteTargetId(id);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await bannerService.delete(deleteTargetId);
      toast.success("Đã xóa banner khỏi luồng trang chủ");
      setDeleteTargetId(null);
      loadBanners();
    } catch (err) { toast.error("Lỗi xóa banner"); }
  };

  // Bộ lọc từ khóa client-side gia tăng vi tương tác
  const filteredBanners = banners.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.link && b.link.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* 🎯 1. PREMIUM HEADER CONTROL ZONE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Quản lý Banner Slider</h1>
          <p className="text-xs text-slate-400 mt-1">Thiết lập chiến dịch ưu đãi, hình ảnh trình chiếu quảng cáo tại đầu trang chủ website.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/10 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Tạo banner ưu đãi mới
        </motion.button>
      </div>

      {/* 🎯 2. INTERACTIVE SEARCH BAR */}
      <div className="flex bg-white p-3 border border-slate-200/60 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Tìm theo tiêu đề banner quảng bá, liên kết điều hướng sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
          />
        </div>
      </div>

      {/* 🎯 3. MAIN COVERS SLIDER TABLE & EMPTY STATE */}
      {loading ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-16 flex justify-center shadow-sm"><Loader /></div>
      ) : filteredBanners.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-16 text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-sm">
            <Image className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy banner</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">Hệ thống chưa ghi nhận hình ảnh chiến dịch nào trùng khớp với từ khóa tìm kiếm.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50/70 border-b border-slate-200/60 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 w-1/2">Hình ảnh thiết kế / Tiêu đề quảng cáo</th>
                  <th className="px-5 py-3.5">Thứ tự vị trí</th>
                  <th className="px-5 py-3.5">Đường dẫn liên kết</th>
                  <th className="px-5 py-3.5">Trạng thái</th>
                  <th className="px-5 py-3.5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredBanners.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition duration-150 group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        {/* 🎯 HOVER ANIMATION THUMBNAIL COVERS */}
                        <div className="w-28 h-12 bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs flex items-center justify-center p-0.5 shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                          <img 
                            src={resolveImageUrl(b.image)} 
                            className="w-full h-full object-cover rounded-lg" 
                            alt="" 
                          />
                        </div>
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm line-clamp-1">{b.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-bold border border-slate-200/40">
                        <MoveUp className="w-3 h-3 text-slate-400" /> Vị trí {b.position}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 font-mono flex items-center gap-1 py-5">
                      <Link2 className="w-3.5 h-3.5 text-slate-300" />
                      {b.link ? <span className="truncate max-w-[150px]">{b.link}</span> : <span className="text-slate-300 italic">Không điều hướng</span>}
                    </td>
                    <td className="px-5 py-4">
                      <button 
                        onClick={() => handleToggle(b.id)} 
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition ${
                          b.status === "PUBLISHED" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100" 
                            : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Click đổi nhanh ẩn hiện"
                      >
                        {b.status === "PUBLISHED" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {b.status === "PUBLISHED" ? "Đang hiện" : "Đang ẩn"}
                      </button>
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

      {/* 🎯 4. HIGH-END FORM MODAL WITH INTEGRATED DRAG & DROP COVERS PREVIEW */}
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
              className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl relative z-10 border border-slate-200/60"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  {editingId ? "Cấu hình chiến dịch Banner" : "Xuất bản Banner quảng cáo mới"}
                </h2>
                <button className="text-slate-400 hover:text-slate-600 p-1" onClick={() => setShowModal(false)}><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 font-medium text-slate-700">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tiêu đề thông điệp chiến dịch</label>
                  <input 
                    name="title" 
                    value={form.title} 
                    onChange={handleChange} 
                    required 
                    placeholder="Ví dụ: Siêu ưu đãi giảm giá xe đua Road 15%..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition" 
                  />
                </div>

                {/* 🎯 INTERACTIVE DRAG & DROP AREA WITH PREMIUM LIVE PREVIEW */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Thiết kế Banner (Tỉ lệ hiển thị rộng)</label>
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-4 transition duration-200 flex flex-col items-center text-center relative ${
                      isDragActive 
                        ? "border-blue-600 bg-blue-50/40" 
                        : "border-slate-200 bg-slate-50/60 hover:bg-slate-50"
                    }`}
                  >
                    {/* KHUNG LIVE PREVIEW HOÀN THIỆN ĐỒNG BỘ */}
                    <div className="w-full aspect-[21/9] rounded-xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center p-0.5 shadow-2xs relative group/preview mb-3">
                      {form.image ? (
                        <img 
                          src={resolveImageUrl(form.image)} 
                          alt="Live Preview" 
                          className="w-full h-full object-cover rounded-lg" 
                        />
                      ) : (
                        <div className="text-slate-400 font-bold flex flex-col items-center gap-1.5">
                          <UploadCloud className="w-6 h-6 text-slate-300" />
                          <span className="text-[10px]">Chưa tích hợp file thiết kế</span>
                        </div>
                      )}
                    </div>

                    <label className="text-xs text-slate-600 font-bold cursor-pointer hover:text-blue-600 transition">
                      {uploading ? "Hệ thống đang đồng bộ file..." : "Thả ảnh vào đây hoặc bấm để chọn tệp"}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageSelect} 
                        disabled={uploading} 
                        className="hidden" 
                      />
                    </label>
                    <p className="text-[9px] text-slate-400 font-medium mt-1">Hỗ trợ kích thước lớn (PNG, JPG, WebP) chuẩn slider.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Liên kết đích khi click</label>
                    <input 
                      name="link" 
                      value={form.link} 
                      onChange={handleChange} 
                      placeholder="Ví dụ: /products hoặc URL đích..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-semibold" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Vị trí sắp xếp slider</label>
                    <input 
                      type="number" 
                      name="position" 
                      value={form.position} 
                      onChange={handleChange} 
                      required
                      min="1"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cấu hình trạng thái khởi tạo</label>
                  <select 
                    name="status" 
                    value={form.status} 
                    onChange={handleChange} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition cursor-pointer font-bold text-blue-600"
                  >
                    <option value="PUBLISHED">Hiển thị kích hoạt vòng lặp</option>
                    <option value="HIDDEN">Ẩn tạm thời (Lưu trữ kho nháp)</option>
                  </select>
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
                    {saving ? "Hệ thống đang lưu..." : "Lưu cấu hình"}
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
              <h3 className="text-sm font-bold text-slate-900">Xác nhận xóa bỏ banner?</h3>
              <p className="text-xs text-slate-400 mt-1 px-2 leading-relaxed">
                Hành động này sẽ gỡ vĩnh viễn hình ảnh quảng cáo này khỏi vòng lặp trình chiếu đầu trang chủ.
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