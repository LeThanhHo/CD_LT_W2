import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import postService from "../services/postService";
// Bổ sung import hàm xử lý đường dẫn ảnh tuyệt đối từ ProductCard
import { resolveImageUrl } from "../components/ProductCard";

export default function PostDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postService.getPostBySlug(slug)
      .then((res) => setPost(res.data))
      .catch((err) => console.error("Lỗi khi tải chi tiết bài viết:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="text-center py-20 font-bold text-slate-600">Đang tải nội dung...</div>;
  if (!post) return <div className="text-center py-20 text-slate-500">Bài viết không tồn tại trên hệ thống hoặc đã bị ẩn.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-white min-h-screen shadow-sm border border-slate-100 my-8 rounded-2xl">
      <div className="mb-6">
        <Link to="/blog" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
          <span>←</span> Quay lại chuyên mục blog
        </Link>
      </div>

      <header className="mb-8 border-b border-slate-100 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
          <span>✍️ Tác giả: <b className="text-slate-700">{post.authorName || "Quản trị viên"}</b></span>
          <span>•</span>
          <span>📅 Đăng ngày: {new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
        </div>
      </header>

      {/* THAY ĐỔI: Khối hiển thị ảnh Banner bài viết bọc qua hàm resolveImageUrl */}
      {post.thumbnail && (
        <div className="w-full aspect-[21/9] rounded-xl overflow-hidden mb-8 shadow-sm border border-slate-50">
          <img 
            src={resolveImageUrl(post.thumbnail)} 
            alt={post.title} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}

      {/* Render Content HTML nội dung văn bản chi tiết */}
      <div 
        className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base sm:text-lg space-y-4 font-normal"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}