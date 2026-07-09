// src/pages/PostDetailPage.jsx
// Senior UI/UX Redesign - Premium Typography Journalism Layout (Medium & Notion Vibe)
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, ChevronRight, BookOpen, FileText } from "lucide-react";
import postService from "../services/postService";
import { resolveImageUrl } from "../components/ProductCard";
import Loader from "../components/Loader";

export default function PostDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    postService
      .getBySlug(slug)
      .then((res) => setPost(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader /></div>;

  if (notFound || !post) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center font-sans text-slate-700 flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-3xs">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="text-sm font-bold text-slate-800">Không tìm thấy bài viết</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">Nội dung bài viết này không tồn tại hoặc đã được gỡ bỏ khỏi hệ thống tạp chí kiểm duyệt.</p>
        <Link to="/posts" className="inline-flex items-center gap-1.5 mt-5 text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest">
          <ArrowLeft className="w-3.5 h-3.5" /> Trở lại chuyên mục
        </Link>
      </div>
    );
  }

  return (
    <motion.article 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-3xl mx-auto px-6 md:px-8 py-10 font-sans text-slate-900"
    >
      {/* 🎯 1. MINIMALIST APPLE BREADCRUMBS BREADCRUMBS */}
      <nav className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-6 border-b border-slate-100 pb-4 select-none">
        <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <Link to="/posts" className="hover:text-blue-600 transition-colors">Tạp chí tin tức</Link>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-600 truncate max-w-[180px] normal-case font-extrabold">{post.title}</span>
      </nav>

      {/* 🎯 2. MAGAZINE EDITORIAL METADATA & TITLE */}
      <div className="space-y-4 mb-6">
        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 leading-snug uppercase">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50 border border-slate-200/40 p-3 rounded-xl shadow-3xs w-max">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {new Date(post.createdAt).toLocaleDateString("vi-VN", { dateStyle: "long" })}
          </span>
          {post.author && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-200" />
              <span className="flex items-center gap-1.5 normal-case font-semibold text-slate-700">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Biên tập viên: <span className="font-extrabold">{post.author}</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* 🎯 3. WIDE APERATURE COVER IMAGE COVER */}
      {post.thumbnail && (
        <div className="aspect-[16/9] bg-slate-50 border border-slate-200/60 rounded-2xl overflow-hidden mb-10 shadow-sm">
          <img
            src={resolveImageUrl(post.thumbnail)}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 🎯 4. NOTION-STYLE CRISP PREMIUM TEXT AREA WRAPPER */}
      <div 
        className="rich-text-prose-container text-slate-700 leading-relaxed space-y-5 text-sm font-medium border-b border-slate-100 pb-10 ql-editor-display"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 🎯 5. BOTTOM NAVIGATION RE-ROUTE REGION */}
      <div className="mt-10 pt-4 flex justify-start">
        <Link 
          to="/posts" 
          className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-white hover:bg-blue-600 border border-slate-200 hover:border-blue-600 bg-white px-4 py-2.5 rounded-xl transition shadow-3xs uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Quay lại danh mục tin tức
        </Link>
      </div>

    </motion.article>
  );
}