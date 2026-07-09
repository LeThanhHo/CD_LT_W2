// src/pages/PostListPage.jsx
// Senior UI/UX Redesign - Premium Editorial Journal Hub Layout Specification
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// Sửa lại dòng này ở đầu file PostListPage.jsx:
import { Calendar, User, BookOpen, ArrowUpRight, SearchX, ChevronRight } from "lucide-react";import postService from "../services/postService";
import { resolveImageUrl } from "../components/ProductCard";
import Loader from "../components/Loader";

export default function PostListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postService
      .getPublished()
      .then((res) => setPosts(res.data || []))
      .catch((err) => console.error("Lỗi khi tải bài viết:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 font-sans text-slate-900">
      
      {/* 🎯 1. PREMIUM HEADER ZONE (Notion & Vercel Style Specification) */}
      <div className="border-b border-slate-200/60 pb-6 mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">
          <BookOpen className="w-3.5 h-3.5" /> Cycling Journal
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 uppercase">
          Bài viết & Tin tức
        </h1>
        <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed mt-2">
          Cập nhật cẩm nang đường trường, kinh nghiệm cân chỉnh kỹ thuật nâng cao và tin tức xu hướng công nghệ xe đạp từ các chuyên gia BikeShop.
        </p>
      </div>

      {/* 🎯 2. COVERS EDITORIAL GRID & EMPTY STATE SPECIFICATION */}
      {posts.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-20 text-center flex flex-col items-center justify-center shadow-2xs">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-sm">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Tạp chí đang được cập nhật</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">Hệ thống biên tập tin tức chưa phát hành bài viết nào trong kỳ này. Quay lại sau nhé.</p>
        </div>
      ) : (
        /* Lưới 3 cột đồng bộ phong cách với trang chủ */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: (idx % 3) * 0.05 }}
              className="flex"
            >
              <Link
                to={`/posts/${post.slug}`}
                className="group w-full bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-xl hover:border-slate-300 flex flex-col justify-between transition-all duration-300"
              >
                {/* 🎯 LARGE ASPECT THUMBNAIL AREA */}
                <div className="aspect-[16/10] bg-slate-50 overflow-hidden relative border-b border-slate-100 shrink-0">
                  <img
                    src={resolveImageUrl(post.thumbnail) || "https://placehold.co/400x225?text=BikeShop"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Floating Icon Indicator */}
                  <div className="absolute bottom-3 right-3 w-7 h-7 bg-slate-900/80 text-white rounded-lg flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* 🎯 TEXT DESCRIPTION CONTENTS */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                  <div className="space-y-2.5">
                    {/* Meta info block */}
                    <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        {new Date(post.createdAt).toLocaleDateString("vi-VN", { dateStyle: "medium" })}
                      </span>
                      {post.author && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-200" />
                          <span className="flex items-center gap-1 normal-case font-semibold text-slate-500">
                            <User className="w-3.5 h-3.5 text-slate-300" />
                            {post.author}
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="font-sans font-black text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 uppercase tracking-tight">
                      {post.title}
                    </h2>
                    
                    {/* Summary text */}
                    <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-50 flex items-center text-[11px] font-black text-blue-600 uppercase tracking-widest gap-1 group-hover:text-blue-700 transition-colors mt-auto">
                    Đọc chi tiết bài viết <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}