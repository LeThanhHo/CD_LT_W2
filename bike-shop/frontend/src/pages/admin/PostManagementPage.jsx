// src/pages/admin/PostManagementPage.jsx
// Senior UI/UX Redesign - Premium Editorial Journal & Notion-style Rich Editor
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  FileText, 
  User, 
  Calendar, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  X, 
  UploadCloud, 
  PenTool,
  BookOpen
} from "lucide-react";
import postService from "../../services/postService";
import uploadService from "../../services/uploadService";
import { resolveImageUrl } from "../../components/ProductCard";
import Loader from "../../components/Loader";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const emptyForm = { title: "", thumbnail: "", content: "", author: "", status: "PUBLISHED" };

export default function PostManagementPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // State quản lý tìm kiếm nhanh cục bộ và Delete Modal cao cấp
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const quillRef = useRef(null);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const res = await uploadService.uploadImage(file);
        const imageUrl = res.data.url || res.data.fileName;
        const fullImageUrl = resolveImageUrl(imageUrl);

        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", fullImageUrl);
        quill.setSelection(range.index + 1);
      } catch (err) {
        console.error(err);
        toast.error("Không thể chèn hình ảnh local vào nội dung bài viết");
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ font: [] }, { size: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }, { align: [] }],
        ["link", "image", "video"],
        ["clean"]
      ],
      handlers: { image: imageHandler }
    }
  }), []);

  const formats = [
    "font", "size", "bold", "italic", "underline", "strike", "color", "background",
    "script", "header", "list", "bullet", "indent", "direction", "align", "link", "image", "video"
  ];

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await postService.getAllAdmin();
      setPosts(res.data || []);
    } catch (err) {
      console.error("=== LỖI API BACKEND ===", err.response?.data);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Lỗi 500 hệ thống";
      const errorTrace = err.response?.data?.trace ? err.response.data.trace.substring(0, 250) : "Không có trace log";
      alert(`❌ LỖI HỆ THỐNG (SPRING BOOT 500):\n\nNguyên nhân: ${errorMessage}\n\nChi tiết: ${errorTrace}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      thumbnail: p.thumbnail || "",
      content: p.content || "",
      author: p.author || "",
      status: p.status,
    });
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleContentChange = (htmlValue) => {
    setForm((prev) => ({ ...prev, content: htmlValue }));
  };

  const handleThumbnailSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      setForm((prev) => ({ ...prev, thumbnail: res.data.url }));
      toast.success("Đã tải ảnh lên thành công");
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể tải ảnh lên");
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
        await postService.update(editingId, form);
        toast.success("Đã cập nhật bài viết tạp chí");
      } else {
        await postService.create(form);
        toast.success("Đã xuất bản bài viết mới thành công");
      }
      setShowModal(false);
      loadPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await postService.toggleVisibility(id);
      toast.success("Đã thay đổi trạng thái ẩn hiện");
      loadPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể thay đổi trạng thái");
    }
  };

  const triggerDeleteConfirm = (id) => {
    setDeleteTargetId(id);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await postService.delete(deleteTargetId);
      toast.success("Đã gỡ bỏ bài viết khỏi tạp chí");
      setDeleteTargetId(null);
      loadPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa bài viết");
    } finally {
      setDeleteTargetId(null);
    }
  };

  // Bộ lọc tìm kiếm nhanh bài viết Client-side
  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.author && p.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* 🎯 1. PREMIUM HEADER CONTROL ZONE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Quản lý bài viết tạp chí</h1>
          <p className="text-xs text-slate-400 mt-1">Biên tập nội dung kiến thức xe đạp, cẩm nang đường trường và quản lý tin tức thương mại.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/10 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Soạn thảo bài viết mới
        </motion.button>
      </div>

      {/* 🎯 2. INTERACTIVE SEARCH BAR */}
      <div className="flex bg-white p-3 border border-slate-200/60 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Tìm theo tiêu đề bài viết, tên biên tập viên tác giả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
          />
        </div>
      </div>

      {/* 🎯 3. MAIN COVERS EDITORIAL GRID & EMPTY STATE */}
      {loading ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-16 flex justify-center shadow-sm"><Loader /></div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-16 text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Tạp chí trống</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">Chưa có bài viết nào được ghi nhận hoặc khớp với từ khóa tìm kiếm biên tập.</p>
        </div>
      ) : (
        /* 🎯 COVERS EDITORIAL CARD GRID BLUEPRINT */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-xl hover:border-slate-300 flex flex-col group transition-all duration-300"
            >
              {/* LARGE THUMBNAIL ZONE & FLAG TAG */}
              <div className="aspect-[16/10] bg-slate-50 overflow-hidden relative border-b border-slate-100">
                <img
                  src={resolveImageUrl(p.thumbnail) || "https://placehold.co/400x225?text=BikeShop"}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                
                {/* PUBLISH STATUS INSIGNIA */}
                <button
                  onClick={() => handleToggleVisibility(p.id)}
                  className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide backdrop-blur-md shadow-xs border transition ${
                    p.status === "PUBLISHED"
                      ? "bg-emerald-500/90 text-white border-emerald-400/20 hover:bg-emerald-600"
                      : "bg-slate-700/90 text-slate-200 border-slate-600/30 hover:bg-slate-800"
                  }`}
                  title="Click đổi nhanh trạng thái ẩn hiện"
                >
                  {p.status === "PUBLISHED" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {p.status === "PUBLISHED" ? "Đang hiện" : "Đang ẩn"}
                </button>

                <div className="absolute bottom-3 left-3 bg-slate-900/60 text-white font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-xs">
                  Cycling Journal
                </div>
              </div>

              {/* DETAILS CARD TEXT CONTENT */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {p.author || "BikeShop Team"}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(p.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                </div>

                {/* BOTTOM COMPONENT CARD CONTROLS BUTTONS */}
                <div className="flex items-center justify-end gap-1.5 border-t border-slate-50 pt-3 mt-auto">
                  <button
                    onClick={() => openEdit(p)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg transition"
                  >
                    <Edit2 className="w-3 h-3" /> Sửa bài
                  </button>
                  <button
                    onClick={() => triggerDeleteConfirm(p.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-white hover:bg-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg transition"
                  >
                    <Trash2 className="w-3 h-3" /> Xóa bài
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 🎯 4. GIANT FORM MODAL WITH NOTION-STYLE TEXT EDITOR */}
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
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] overflow-hidden p-6 shadow-2xl relative z-10 border border-slate-200/60 flex flex-col"
            >
              {/* Form Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-blue-600" />
                  {editingId ? "Cấu hình xuất bản bài viết" : "Soạn thảo bài viết mới"}
                </h2>
                <button className="text-slate-400 hover:text-slate-600 p-1" onClick={() => setShowModal(false)}><X className="w-4 h-4" /></button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 font-medium text-slate-700 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tiêu đề bài viết</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      placeholder="Nhập tiêu đề hấp dẫn cuốn hút người đọc..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tác giả biên tập</label>
                    <input
                      name="author"
                      value={form.author}
                      onChange={handleChange}
                      placeholder="Ví dụ: BikeShop Team, Nguyễn Văn A..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* THUMBNAIL SELECTION ROW */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ảnh đại diện bài viết (Thumbnail Cover)</label>
                  <div className="flex items-center gap-4 p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                    <div className="w-24 h-14 rounded-xl border border-slate-200/80 bg-white overflow-hidden shrink-0 flex items-center justify-center shadow-sm p-0.5">
                      {form.thumbnail ? (
                        <img src={resolveImageUrl(form.thumbnail)} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">No Image</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-bold hover:bg-slate-50 cursor-pointer shadow-sm transition">
                        <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                        {uploading ? "Hệ thống đang đẩy..." : "Tải ảnh nền bài viết"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailSelect}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">Kích thước khuyến nghị tỉ lệ 16:10 để đạt hiển thị đẹp nhất.</p>
                    </div>
                  </div>
                </div>

                {/* 🎯 NOTION-STYLE BEAUTIFUL TEXT EDITOR AREA */}
                <div className="flex flex-col flex-1 min-h-[380px]">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nội dung văn bản chi tiết</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col flex-1 relative ql-premium-wrapper">
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={form.content}
                      onChange={handleContentChange}
                      modules={modules}
                      formats={formats}
                      placeholder="Bắt đầu gõ nội dung chia sẻ kiến thức, chèn liên kết hình ảnh xe đạp đỉnh cao tại đây..."
                      className="flex-1 flex flex-col"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cấu hình trạng thái</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition cursor-pointer font-bold"
                    >
                      <option value="PUBLISHED">Công khai xuất bản trên Website</option>
                      <option value="HIDDEN">Ẩn bài viết (Lưu bản nháp ngầm)</option>
                    </select>
                  </div>
                </div>

                {/* Form Footer Buttons Sticky at bottom inside modal */}
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl transition"
                  >
                    Hủy soạn
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition disabled:opacity-60 shadow-md shadow-blue-600/10"
                  >
                    {saving ? "Hệ thống đang lưu..." : "Phát hành bài viết"}
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
              <h3 className="text-sm font-bold text-slate-900">Xác nhận gỡ bài viết?</h3>
              <p className="text-xs text-slate-400 mt-1 px-2 leading-relaxed">
                Hành động này sẽ xóa bài viết vĩnh viễn khỏi mục tạp chí tin tức và không thể khôi phục nội dung văn bản.
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