import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import postService from "../../services/postService";
import uploadService from "../../services/uploadService";
import { resolveImageUrl } from "../../components/ProductCard";
import Loader from "../../components/Loader";

const emptyForm = { title: "", thumbnail: "", content: "", author: "", status: "PUBLISHED" };

export default function PostManagementPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await postService.getAllAdmin();
      setPosts(res.data);
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
      content: p.content,
      author: p.author || "",
      status: p.status,
    });
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
        toast.success("Đã cập nhật bài viết");
      } else {
        await postService.create(form);
        toast.success("Đã đăng bài viết mới");
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
      loadPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể thay đổi trạng thái");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
      await postService.delete(id);
      toast.success("Đã xóa bài viết");
      loadPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa bài viết");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Quản lý bài viết</h1>
        <button
          onClick={openCreate}
          className="bg-ember text-white text-sm font-semibold px-4 py-2 rounded-md hover:brightness-95"
        >
          + Thêm bài viết
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-steel text-left">
              <tr>
                <th className="px-4 py-3">Bài viết</th>
                <th className="px-4 py-3">Tác giả</th>
                <th className="px-4 py-3">Ngày đăng</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={resolveImageUrl(p.thumbnail) || "https://placehold.co/48x32?text=Post"}
                        alt=""
                        className="w-12 h-8 rounded-md object-cover shrink-0"
                      />
                      <span className="font-medium text-ink line-clamp-1">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-steel">{p.author || "-"}</td>
                  <td className="px-4 py-3 text-steel">
                    {new Date(p.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleVisibility(p.id)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        p.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-steel"
                      }`}
                    >
                      {p.status === "PUBLISHED" ? "Đang hiện" : "Đang ẩn"}
                    </button>
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
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="font-display text-xl text-ink mb-4">
              {editingId ? "Sửa bài viết" : "Thêm bài viết mới"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Tiêu đề</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Ảnh đại diện</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-md border border-gray-200 bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                    {form.thumbnail ? (
                      <img
                        src={resolveImageUrl(form.thumbnail)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-steel">Chưa có ảnh</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                    onChange={handleThumbnailSelect}
                    disabled={uploading}
                    className="flex-1 text-sm text-steel file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-ink file:text-white hover:file:bg-black file:cursor-pointer disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Tác giả</label>
                <input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="BikeShop Team"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Nội dung</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Trạng thái</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="PUBLISHED">Hiển thị</option>
                  <option value="HIDDEN">Ẩn</option>
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
