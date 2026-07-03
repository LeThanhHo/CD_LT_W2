import React, { useEffect, useState, useRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 

import postService from "../../services/postService";
import uploadService from "../../services/uploadService";
import { resolveImageUrl } from "../../components/ProductCard";

export default function PostManagement() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", slug: "", summary: "", content: "", thumbnail: "", status: "DRAFT" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Tạo một ref để tham chiếu trực tiếp đến thực thể ReactQuill
  const quillRef = useRef(null);

  // --- HÀM XỬ LÝ CHỌN VÀ UPLOAD ẢNH TỪ MÁY TÍNH VÀO NỘI DUNG ---
  const imageHandler = () => {
    // 1. Tạo một input file ẩn để kích hoạt trình duyệt chọn ảnh local
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    // 2. Lắng nghe sự kiện khi người dùng chọn xong file từ máy tính
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        // Gọi API upload ảnh local lên server
        const res = await uploadService.uploadImage(file);
        const imageUrl = res.data.url || res.data.fileName;
        // Chuyển đổi sang đường dẫn tuyệt đối để hiển thị chuẩn chỉnh
        const fullImageUrl = resolveImageUrl(imageUrl);

        // 3. Chèn ảnh vào vị trí con trỏ hiện tại trong trình soạn thảo
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", fullImageUrl);
        // Di chuyển con trỏ chuột xuống dưới bức ảnh vừa chèn
        quill.setSelection(range.index + 1);
      } catch (err) {
        console.error("Lỗi chèn ảnh vào trình soạn thảo:", err);
        alert("Không thể tải hình ảnh này từ máy tính lên nội dung bài viết");
      }
    };
  };

  // --- CẤU HÌNH CÁC CHỨC NĂNG TRÊN TOOLBAR (CÓ NÚT IMAGE) ---
  // Sử dụng useMemo để cấu hình không bị khởi tạo lại làm mất con trỏ chuột khi gõ chữ
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"], // Thêm nút "image" vào thanh công cụ
        ["clean"]
      ],
      handlers: {
        image: imageHandler // Đè hành động click nút image mặc định bằng hàm custom local upload của mình
      }
    }
  }), []);

  const formats = [
    "header", "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet", "link", "image"
  ];

  const loadPosts = () => {
    postService.getAllAdmin().then((res) => setPosts(res.data));
  };

  useEffect(() => { loadPosts(); }, []);

  const handleThumbnailSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      const imageUrl = res.data.url || res.data.fileName; 
      setForm((prev) => ({ ...prev, thumbnail: imageUrl }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Không thể tải hình ảnh lên");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (uploading) {
      alert("Vui lòng đợi quá trình tải ảnh hoàn tất!");
      return;
    }
    
    if (editingId) {
      postService.update(editingId, form).then(() => {
        alert("Cập nhật bài viết thành công!");
        handleCloseForm();
        loadPosts();
      });
    } else {
      postService.create(form).then(() => {
        alert("Tạo bài viết mới thành công!");
        handleCloseForm();
        loadPosts();
      });
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({ title: "", slug: "", summary: "", content: "", thumbnail: "", status: "DRAFT" });
    setShowForm(true);
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({ title: p.title, slug: p.slug, summary: p.summary, content: p.content, thumbnail: p.thumbnail, status: p.status });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ title: "", slug: "", summary: "", content: "", thumbnail: "", status: "DRAFT" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa bài viết này không?")) {
      postService.delete(id).then(() => {
        alert("Đã xóa bài viết!");
        loadPosts();
      });
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-7 bg-blue-600 rounded-full" />
          Quản lý bài viết hệ thống
        </h1>
        {!showForm && (
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md"
          >
            ➕ Thêm bài viết mới
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-10 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-lg font-black text-slate-700">
              {editingId ? "📝 CẬP NHẬT BÀI VIẾT" : "✨ SOẠN THẢO BÀI VIẾT MỚI"}
            </h2>
            <button 
              type="button" 
              onClick={handleCloseForm}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg"
            >
              Đóng form ✖
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Tiêu đề bài viết</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Đường dẫn tĩnh (Slug - tùy chọn)</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="dạng: xe-dap-dep" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Ảnh đại diện bài viết (Thumbnail ngoài danh sách)</label>
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                <div className="w-16 h-16 rounded-xl border bg-white overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-sm">
                  {form.thumbnail ? (
                    <img src={resolveImageUrl(form.thumbnail)} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-[11px] text-gray-400 font-semibold">Trống</span>
                  )}
                </div>
                <div className="flex-grow">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailSelect}
                    disabled={uploading}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-white hover:file:bg-slate-700 file:cursor-pointer disabled:opacity-50"
                  />
                  {uploading && <p className="text-[11px] text-blue-600 font-bold mt-1.5 animate-pulse">⏳ Đang tải ảnh...</p>}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Trạng thái xuất bản</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-semibold bg-white focus:outline-none mt-1">
                <option value="DRAFT">Bản nháp (DRAFT)</option>
                <option value="PUBLISHED">Công khai (PUBLISHED)</option>
                <option value="ARCHIVED">Lưu trữ/Ẩn (ARCHIVED)</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Tóm tắt ngắn (Summary)</label>
            <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows="2" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none" required></textarea>
          </div>
          
          {/* Trình soạn thảo văn bản đã tích hợp upload ảnh local */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Nội dung chi tiết bài viết (Có thể viết chữ và chèn ảnh trực tiếp)</label>
            <div className="bg-white rounded-xl overflow-hidden border border-slate-200 min-h-[360px]">
              <ReactQuill 
                ref={quillRef} // Gán ref
                theme="snow"
                value={form.content}
                onChange={(htmlValue) => setForm((prev) => ({ ...prev, content: htmlValue }))}
                modules={modules}
                formats={formats}
                placeholder="Nhập nội dung và click icon Hình Ảnh trên thanh công cụ để chọn ảnh từ máy tính..."
                className="h-[300px] mb-12 border-none"
              />
            </div>
          </div>
          
          <div className="flex gap-2 justify-end pt-3 border-t border-slate-50">
            <button type="button" onClick={handleCloseForm} className="bg-slate-100 text-slate-600 font-bold px-4 py-2 rounded-xl text-sm hover:bg-slate-200">
              Hủy bỏ
            </button>
            <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-2 rounded-xl text-sm hover:bg-blue-700 shadow-md">
              {editingId ? "Cập nhật ngay" : "Đăng bài viết"}
            </button>
          </div>
        </form>
      )}

      {/* List Table Data */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white text-xs uppercase tracking-wider font-bold">
              <th className="p-4">ID</th>
              <th className="p-4">Ảnh</th>
              <th className="p-4">Tiêu đề bài viết</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm font-medium text-slate-700">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80 transition">
                <td className="p-4 font-bold text-slate-400">#{p.id}</td>
                <td className="p-4">
                  <img src={resolveImageUrl(p.thumbnail) || "https://placehold.co/50x50?text=Blog"} alt="" className="w-10 h-10 object-cover rounded-lg border shadow-sm" />
                </td>
                <td className="p-4 font-bold text-slate-900 max-w-xs truncate">{p.title}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${p.status === "PUBLISHED" ? "bg-green-50 text-green-700" : p.status === "DRAFT" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-700"}`}>{p.status}</span>
                </td>
                <td className="p-4 text-center space-x-3 font-semibold">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800 transition-colors">
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-rose-600 hover:text-rose-800 transition-colors">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}