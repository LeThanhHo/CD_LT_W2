import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
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

  const loadProducts = async (p = page) => {
    setLoading(true);
    try {
      const res = await productService.getAll({ page: p, size: 10 });
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(0);
    categoryService.getAll().then((res) => setCategories(res.data));
    brandService.getAll().then((res) => setBrands(res.data));
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
        toast.success("Đã cập nhật sản phẩm");
      } else {
        await productService.create(payload);
        toast.success("Đã thêm sản phẩm mới");
      }
      setShowModal(false);
      loadProducts(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await productService.delete(id);
      toast.success("Đã xóa sản phẩm");
      loadProducts(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa sản phẩm");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Quản lý sản phẩm</h1>
        <button
          onClick={openCreate}
          className="bg-ember text-white text-sm font-semibold px-4 py-2 rounded-md hover:brightness-95"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-steel text-left">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3">Hãng</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3">Kho</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={resolveImageUrl(p.image) || "https://placehold.co/48x48?text=Bike"}
                        alt=""
                        className="w-10 h-10 rounded-md object-cover"
                      />
                      <span className="font-medium text-ink line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-steel">{p.categoryName}</td>
                  <td className="px-4 py-3 text-steel">{p.brandName}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{formatVND(p.price)}</td>
                  <td className="px-4 py-3 text-steel">{p.quantity}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-steel">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline">
                      Sửa
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 py-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPage(i);
                    loadProducts(i);
                  }}
                  className={`w-8 h-8 rounded-md text-sm font-medium ${
                    page === i ? "bg-ember text-white" : "bg-gray-100 text-steel"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="font-display text-xl text-ink mb-4">
              {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Tên sản phẩm</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Giá (VND)</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Số lượng</label>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Hình ảnh sản phẩm</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-md border border-gray-200 bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                    {form.image ? (
                      <img
                        src={resolveImageUrl(form.image)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-steel">Chưa có ảnh</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                      onChange={handleImageSelect}
                      disabled={uploading}
                      className="w-full text-sm text-steel file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-ink file:text-white hover:file:bg-black file:cursor-pointer disabled:opacity-60"
                    />
                    {uploading && <p className="text-xs text-steel mt-1">Đang tải ảnh lên...</p>}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Danh mục</label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">-- Chọn --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Hãng xe</label>
                  <select
                    name="brandId"
                    value={form.brandId}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">-- Chọn --</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Trạng thái</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="AVAILABLE">Còn hàng</option>
                  <option value="OUT_OF_STOCK">Hết hàng</option>
                  <option value="DISCONTINUED">Ngừng kinh doanh</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-steel hover:text-ink"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="bg-ember text-white text-sm font-semibold px-5 py-2 rounded-md hover:brightness-95 disabled:opacity-60"
                >
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}