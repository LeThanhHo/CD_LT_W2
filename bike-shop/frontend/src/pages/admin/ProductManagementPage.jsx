// src/pages/admin/ProductManagementPage.jsx
// Senior UI/UX Redesign - shadcn/ui & Ant Design Layout Specification
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Package, 
  Layers, 
  Tag, 
  Boxes, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  UploadCloud
} from "lucide-react";

import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import brandService from "../../services/brandService";
import uploadService from "../../services/uploadService";
import { formatVND, resolveImageUrl } from "../../components/ProductCard";
import Loader from "../../components/Loader";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  image: "",
  categoryId: "",
  brandId: "",
  status: "AVAILABLE",
};

export default function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // State phụ phục vụ riêng cho hiệu ứng Delete Modal chuẩn tương tác
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");

  const loadProducts = async (p = page) => {
    setLoading(true);
    try {
      const res = await productService.getAll({ page: p, size: 10 });
      setProducts(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      toast.error("Không thể tải danh sách kho hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(0);
    categoryService.getAll().then((res) => setCategories(res.data || []));
    brandService.getAll().then((res) => setBrands(res.data || []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      quantity: p.quantity,
      image: p.image || "",
      categoryId: p.categoryId,
      brandId: p.brandId,
      status: p.status,
    });
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      setForm((prev) => ({ ...prev, image: res.data.url }));
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
    const payload = {
      ...form,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
      categoryId: parseInt(form.categoryId, 10),
      brandId: parseInt(form.brandId, 10),
    };
    try {
      if (editingId) {
        await productService.update(editingId, payload);
        toast.success("Đã cập nhật dữ liệu xe");
      } else {
        await productService.create(payload);
        toast.success("Đã thêm sản phẩm mới vào kho");
      }
      setShowModal(false);
      loadProducts(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi lưu");
    } finally {
      setSaving(false);
    }
  };

  // Thay thế hàm confirm thô bằng việc kích hoạt Drawer/Modal xóa cao cấp
  const triggerDeleteConfirm = (id) => {
    setDeleteTargetId(id);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await productService.delete(deleteTargetId);
      toast.success("Đã xóa sản phẩm khỏi hệ thống");
      setDeleteTargetId(null);
      loadProducts(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể thực thi xóa");
    }
  };

  // Thuật toán bọc lót lọc nhanh Client-side kết hợp tính năng gõ tìm kiếm tương tác
  const clientFilteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter ? p.categoryId === Number(selectedCategoryFilter) : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* 🎯 1. PREMIUM HEADER CONTROL ZONE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Danh mục kho hàng</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý vòng đời sản phẩm, số lượng tồn kho và cấu hình mức giá.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/10 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Thêm sản phẩm mới
        </motion.button>
      </div>

      {/* 🎯 2. INTERACTIVE SEARCH & FILTER CONTROLS BAR (shadcn/ui layout) */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 border border-slate-200/60 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Tìm mã sản phẩm, tên dòng xe đạp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative inline-flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-600 focus:outline-none pr-6 py-2 cursor-pointer appearance-none"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 🎯 3. MAIN TABLE ZONE (Ant Design & shadcn/ui Spec) */}
      {loading ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-16 flex justify-center shadow-sm"><Loader /></div>
      ) : clientFilteredProducts.length === 0 ? (
        /* 🎯 4. EMPTY STATE SPECIFICATION */
        <div className="bg-white border border-slate-200/60 rounded-2xl p-16 text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-sm">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy xe phù hợp</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">Kho hàng chưa có bản ghi nào khớp với từ khóa tìm kiếm hoặc danh mục đã lọc.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50/70 border-b border-slate-200/60 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Thông tin xe</th>
                  <th className="px-5 py-3.5">Phân loại</th>
                  <th className="px-5 py-3.5">Thương hiệu</th>
                  <th className="px-5 py-3.5">Đơn giá</th>
                  <th className="px-5 py-3.5">Tồn kho</th>
                  <th className="px-5 py-3.5">Trạng thái</th>
                  <th className="px-5 py-3.5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {clientFilteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition duration-150 group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1 transition-transform group-hover:scale-105">
                          <img
                            src={resolveImageUrl(p.image) || "https://placehold.co/48x48?text=Bike"}
                            alt=""
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{p.categoryName}</td>
                    <td className="px-5 py-4 text-slate-500">
                      <span className="inline-flex items-center bg-slate-50 px-2 py-0.5 border border-slate-200/50 rounded-md text-[11px] text-slate-600">
                        {p.brandName}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">{formatVND(p.price)}</td>
                    <td className="px-5 py-4">
                      <span className={`font-semibold ${p.quantity <= 3 ? "text-amber-600 font-bold" : "text-slate-500"}`}>
                        {p.quantity} chiếc
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        p.status === "AVAILABLE" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" 
                          : p.status === "OUT_OF_STOCK"
                          ? "bg-amber-50 text-amber-700 border-amber-200/40"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.status === "AVAILABLE" ? "bg-emerald-500" : p.status === "OUT_OF_STOCK" ? "bg-amber-500" : "bg-slate-400"}`} />
                        {p.status === "AVAILABLE" ? "Sẵn sàng" : p.status === "OUT_OF_STOCK" ? "Hết hàng" : "Ngừng kinh doanh"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button 
                        onClick={() => openEdit(p)} 
                        className="p-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition inline-flex items-center"
                        title="Sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => triggerDeleteConfirm(p.id)} 
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

          {/* 🎯 5. MINIMAL PAGINATION CONTROLS CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 bg-slate-50/50">
              <span className="text-xs text-slate-400">Trang <span className="font-bold text-slate-700">{page + 1}</span> trên <span className="font-bold text-slate-700">{totalPages}</span></span>
              <div className="flex gap-1.5">
                <button
                  disabled={page === 0}
                  onClick={() => { setPage(page - 1); loadProducts(page - 1); }}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition inline-flex items-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => { setPage(i); loadProducts(i); }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                      page === i ? "bg-blue-600 text-white shadow-sm shadow-blue-500/10" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === totalPages - 1}
                  onClick={() => { setPage(page + 1); loadProducts(page + 1); }}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition inline-flex items-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🎯 6. HIGH-END FORM MODAL (ADD & EDIT) */}
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
              className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative z-10 border border-slate-200/60 custom-scrollbar"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  {editingId ? "Cấu hình sản phẩm" : "Thêm thiết bị mới vào kho"}
                </h2>
                <button className="text-slate-400 hover:text-slate-600 p-1" onClick={() => setShowModal(false)}><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 font-medium text-slate-700">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tên sản phẩm xe đạp</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Nhập tên dòng xe (ví dụ: Canyon Aeroad CFR)..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mô tả thông số kỹ thuật</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Cấu hình khung sườn, bộ truyền động, phuộc..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Giá bán công khai (₫)</label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Số lượng nhập kho</label>
                    <input
                      type="number"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Hình ảnh thương mại</label>
                  <div className="flex items-center gap-4 p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                    <div className="w-16 h-16 rounded-xl border border-slate-200/80 bg-white overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-sm">
                      {form.image ? (
                        <img src={resolveImageUrl(form.image)} alt="" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">No Image</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-bold hover:bg-slate-50 cursor-pointer shadow-sm transition">
                        <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                        {uploading ? "Đang đẩy ảnh lên..." : "Tải ảnh từ máy"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">Hỗ trợ PNG, JPG, WebP chính hãng.</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Danh mục hệ thống</label>
                    <select
                      name="categoryId"
                      value={form.categoryId}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition cursor-pointer"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Hãng sản xuất</label>
                    <select
                      name="brandId"
                      value={form.brandId}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition cursor-pointer"
                    >
                      <option value="">-- Chọn thương hiệu --</option>
                      {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Trạng thái vận hành</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition cursor-pointer font-semibold"
                  >
                    <option value="AVAILABLE">Còn hàng sẵn sàng</option>
                    <option value="OUT_OF_STOCK">Tạm hết hàng kho</option>
                    <option value="DISCONTINUED">Ngừng kinh doanh phân phối</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl transition"
                  >
                    Hủy bốc
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

      {/* 🎯 7. PREMIUM SHADCN/UI STYLE DELETE MODAL SPECIFICATION */}
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
              <h3 className="text-sm font-bold text-slate-900">Xác nhận gỡ bỏ sản phẩm?</h3>
              <p className="text-xs text-slate-400 mt-1 px-2 leading-relaxed">
                Hành động này sẽ xóa vĩnh viễn bản ghi xe đạp này khỏi cơ sở dữ liệu và không thể hoàn tác phục hồi.
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