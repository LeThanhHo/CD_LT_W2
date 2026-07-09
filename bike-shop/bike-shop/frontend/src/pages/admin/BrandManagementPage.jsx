import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
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

  const loadBrands = async () => {
    setLoading(true);
    try {
      const res = await brandService.getAll();
      setBrands(res.data);
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
        toast.success("Đã cập nhật hãng xe");
      } else {
        await brandService.create(form);
        toast.success("Đã thêm hãng xe mới");
      }
      setShowModal(false);
      loadBrands();
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa hãng xe này?")) return;
    try {
      await brandService.delete(id);
      toast.success("Đã xóa hãng xe");
      loadBrands();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa hãng xe (có thể đang được sử dụng)");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Quản lý hãng xe</h1>
        <button
          onClick={openCreate}
          className="bg-ember text-white text-sm font-semibold px-4 py-2 rounded-md hover:brightness-95"
        >
          + Thêm hãng xe
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-steel text-left">
              <tr>
                <th className="px-4 py-3">Logo</th>
                <th className="px-4 py-3">Tên hãng</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {brands.map((b) => (
                <tr key={b.id}>
                  <td className="px-4 py-3">
                    <img
                      src={resolveImageUrl(b.logo) || "https://placehold.co/40x40?text=Logo"}
                      alt=""
                      className="w-8 h-8 object-contain"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{b.name}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(b)} className="text-blue-600 hover:underline">
                      Sửa
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:underline">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="font-display text-xl text-ink mb-4">
              {editingId ? "Sửa hãng xe" : "Thêm hãng xe mới"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Tên hãng</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Logo hãng xe</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md border border-gray-200 bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                    {form.logo ? (
                      <img
                        src={resolveImageUrl(form.logo)}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-steel">Chưa có</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                      onChange={handleLogoSelect}
                      disabled={uploading}
                      className="w-full text-sm text-steel file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-ink file:text-white hover:file:bg-black file:cursor-pointer disabled:opacity-60"
                    />
                    {uploading && <p className="text-xs text-steel mt-1">Đang tải logo lên...</p>}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
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
