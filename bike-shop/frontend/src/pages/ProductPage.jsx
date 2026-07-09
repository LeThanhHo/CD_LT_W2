// src/pages/ProductPage.jsx
// Senior UI/UX Redesign - Premium Discovery & Filter Hub (Canyon & shadcn/ui Spec)
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, 
  Layers, 
  Bike, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  SearchX
} from "lucide-react";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import brandService from "../services/brandService";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function ProductPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const keyword = searchParams.get("keyword") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const brandId = searchParams.get("brandId") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const page = parseInt(searchParams.get("page") || "0", 10);

  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data || []));
    brandService.getAll().then((res) => setBrands(res.data || []));
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getAll({
        keyword: keyword || undefined,
        categoryId: categoryId || undefined,
        brandId: brandId || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sortBy: sortBy || undefined,
        page,
        size: 12,
      });
      setProducts(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("Không thể tải danh sách sản phẩm", err);
    } finally {
      setLoading(false);
    }
  }, [keyword, categoryId, brandId, minPrice, maxPrice, sortBy, page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "0");
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 font-sans text-slate-900">
      
      {/* 🎯 1. PREMIUM HEADER TITLE ZONE */}
      <div className="border-b border-slate-200/60 pb-5 mb-8">
        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 uppercase">
          {keyword ? `Kết quả tìm kiếm` : "BỘ SƯU TẬP XE ĐẠP"}
        </h1>
        {keyword && (
          <p className="text-xs text-slate-400 font-semibold mt-1.5">
            Tìm thấy {products.length} siêu phẩm tương thích với từ khóa <span className="text-blue-600">“{keyword}”</span>
          </p>
        )}
      </div>

      {/* CẤU TRÚC LƯỚI HAI CỘT CHUẨN ĐƯỜNG ĐUA CANYON */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
        
        {/* 🎯 2. SIDEBAR FILTER MATRIX (Apple & Notion Architecture) */}
        <aside className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] sticky top-20">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-black uppercase tracking-wider">Bộ lọc tối ưu</h2>
          </div>

          {/* KHỐI BỘ LỌC DANH MỤC */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Dòng xe chuyên dụng
            </h3>
            <div className="space-y-1 text-xs font-semibold">
              <button
                onClick={() => updateParam("categoryId", "")}
                className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between ${
                  !categoryId 
                    ? "bg-blue-50 text-blue-600 font-bold" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>Tất cả phân khúc</span>
                {!categoryId && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </button>
              {categories.map((c) => {
                const isActive = categoryId === String(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => updateParam("categoryId", c.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between ${
                      isActive 
                        ? "bg-blue-50 text-blue-600 font-bold" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* KHỐI BỘ LỌC THƯƠNG HIỆU */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Bike className="w-3.5 h-3.5" /> Hãng sản xuất
            </h3>
            <div className="space-y-1 text-xs font-semibold">
              <button
                onClick={() => updateParam("brandId", "")}
                className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between ${
                  !brandId 
                    ? "bg-blue-50 text-blue-600 font-bold" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>Tất cả thương hiệu</span>
                {!brandId && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </button>
              {brands.map((b) => {
                const isActive = brandId === String(b.id);
                return (
                  <button
                    key={b.id}
                    onClick={() => updateParam("brandId", b.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between ${
                      isActive 
                        ? "bg-blue-50 text-blue-600 font-bold" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{b.name}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* KHỐI LỌC KHOẢNG GIÁ FLATTEN */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Khoảng giá đầu tư
            </h3>
            <div className="flex gap-2 items-center font-semibold text-xs">
              <input
                type="number"
                placeholder="Từ ₫"
                defaultValue={minPrice}
                onBlur={(e) => updateParam("minPrice", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-center focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
              <span className="text-slate-300 font-medium">—</span>
              <input
                type="number"
                placeholder="Đến ₫"
                defaultValue={maxPrice}
                onBlur={(e) => updateParam("maxPrice", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-center focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>
          </div>
        </aside>

        {/* CỘT PHẢI: LƯỚI HIỂN THỊ SẢN PHẨM KHÔNG GIAN CHÍNH */}
        <div className="space-y-5">
          
          {/* 🎯 3. UPPER CONTROL BAR (Sort drop dropdown & Total items trace) */}
          <div className="flex items-center justify-between bg-white p-2.5 border border-slate-200/60 rounded-2xl shadow-3xs">
            <div className="text-slate-400 font-bold text-[10px] uppercase tracking-wider pl-2.5">
              BikeShop Engineering Directory
            </div>
            
            <div className="relative inline-flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 mr-2" />
              <select
                value={sortBy}
                onChange={(e) => updateParam("sortBy", e.target.value)}
                className="bg-transparent border-none text-xs text-slate-600 font-bold focus:outline-none pr-5 py-1 cursor-pointer appearance-none"
              >
                <option value="">Sắp xếp: Mặc định</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
                <option value="newest">Mẫu mới ra mắt</option>
                <option value="name_asc">Tên sản phẩm A-Z</option>
              </select>
            </div>
          </div>

          {/* 🎯 4. GRID DATA INTERACTION & EMPTY STATE */}
          {loading ? (
            <div className="min-h-[40vh] flex items-center justify-center bg-white border border-slate-200/60 rounded-2xl"><Loader /></div>
          ) : products.length === 0 ? (
            /* 🎯 EMPTY STATE SPECIFICATION */
            <div className="bg-white border border-slate-200/60 rounded-2xl p-20 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-sm">
                <SearchX className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Không tìm thấy mẫu xe tương thích</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">Bộ lọc hiện tại không trả về kết quả nào trong kho. Thử nới rộng khoảng giá hoặc chọn thương hiệu khác.</p>
            </div>
          ) : (
            <>
              {/* Lưới sản phẩm Responsive đồng bộ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: (idx % 4) * 0.04 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>

              {/* 🎯 5. MINIMAL PAGINATION DOT CONTROLS CONTROLS */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-10 border-t border-slate-200/40 mt-8">
                  <button
                    disabled={page === 0}
                    onClick={() => updateParam("page", page - 1)}
                    className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition inline-flex items-center"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => updateParam("page", i)}
                      className={`w-8.5 h-8.5 rounded-xl text-xs font-black transition ${
                        page === i 
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-500/10" 
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={page === totalPages - 1}
                    onClick={() => updateParam("page", page + 1)}
                    className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition inline-flex items-center"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}