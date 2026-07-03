import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import postService from "../services/postService";
// Bổ sung import hàm xử lý đường dẫn ảnh tuyệt đối từ ProductCard
import { resolveImageUrl } from "../components/ProductCard";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postService.getPublicPosts()
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Lỗi khi tải bài viết:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 font-bold text-slate-600">Đang tải bài viết...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 bg-slate-50/50 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">CẨM NANG XE ĐẠP</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Chia sẻ kinh nghiệm đạp xe, kiến thức bảo trì và các xu hướng công nghệ mới nhất từ các chuyên gia.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                {/* THAY ĐỔI: Bọc b.thumbnail qua hàm resolveImageUrl */}
                <img 
                  src={resolveImageUrl(post.thumbnail) || "https://placehold.co/600x400?text=BikeShop+News"} 
                  alt={post.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-out" 
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Tin tức & Kinh nghiệm</span>
                <h2 className="text-xl font-bold text-slate-800 mt-2 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">{post.summary}</p>
              </div>
            </div>
            <div className="p-5 pt-0 mt-auto flex items-center justify-between border-t border-slate-50 pt-4 text-xs font-semibold text-slate-400">
              <span>🗓️ {new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
              <Link to={`/blog/${post.slug}`} className="text-blue-600 font-bold hover:text-blue-700 flex items-center gap-0.5">Đọc thêm →</Link>
            </div>
          </article>
        ))}
        {posts.length === 0 && (
          <div className="col-span-3 text-center py-20 text-slate-400 font-medium">
            Hiện tại chưa có bài viết nào được xuất bản công khai.
          </div>
        )}
      </div>
    </div>
  );
}