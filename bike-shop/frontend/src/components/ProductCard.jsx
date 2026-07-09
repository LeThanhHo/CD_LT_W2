// src/components/ProductCard.jsx
// Senior UI/UX Redesign - Premium Product Display Engine (Canyon, Specialized & Apple Spec)
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Heart, Star, ShoppingBag } from "lucide-react";
import favoriteService from "../services/favoriteService";

const formatVND = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

const API_ORIGIN = process.env.REACT_APP_API_ORIGIN || "http://localhost:8080";
const resolveImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/uploads/")) return `${API_ORIGIN}${path}`;
  return path;
};

export default function ProductCard({ product }) {
  const outOfStock = product.status === "OUT_OF_STOCK" || product.quantity === 0;
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (isAuthenticated) {
      favoriteService
        .isFavorite(product.id)
        .then((res) => {
          if (!cancelled) setIsFavorite(res.data);
        })
        .catch(() => {});
    } else {
      setIsFavorite(false);
    }
    return () => {
      cancelled = true;
    };
  }, [product.id, isAuthenticated]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để lưu sản phẩm yêu thích");
      return;
    }
    if (checking) return;
    document.dispatchEvent(new CustomEvent("trigger-bell"));
    setChecking(true);
    try {
      if (isFavorite) {
        await favoriteService.remove(product.id);
        setIsFavorite(false);
        toast.success("Đã bỏ yêu thích");
      } else {
        await favoriteService.add(product.id);
        setIsFavorite(true);
        toast.success("Đã thêm vào yêu thích");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setChecking(false);
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-[0_16px_40px_rgba(0,0,0,0.035)] hover:-translate-y-1.5 transition-all duration-300 relative"
    >
      {/* THUMBNAIL COVER ZONE - Apple Canvas Style */}
      <div className="relative aspect-square bg-[#F8FAFC] overflow-hidden flex items-center justify-center p-4">
        <img
          src={resolveImageUrl(product.image) || "https://placehold.co/400x400?text=Bike"}
          alt={product.name}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* OUT OF STOCK OR AVAILABILITY BADGES */}
        {outOfStock ? (
          <span className="absolute top-3 left-3 bg-[#0F172A]/90 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border border-white/5 shadow-sm">
            Tạm hết hàng
          </span>
        ) : product.quantity <= 3 ? (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm animate-pulse">
            Sắp hết hàng
          </span>
        ) : null}

        {/* BRAND INSIGNIA BADGE */}
        {product.brandName && (
          <span className="absolute top-3 right-3 bg-white/85 backdrop-blur-xs border border-slate-200/50 text-[#0F172A] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-2xs">
            {product.brandName}
          </span>
        )}

        {/* INTERACTIVE HEART BUTTON - Physics Bounce Effect */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={handleToggleFavorite}
          aria-label="Yêu thích"
          className={`absolute bottom-3 right-3 w-8.5 h-8.5 rounded-full flex items-center justify-center shadow-md transition-all duration-300 z-10 ${
            isFavorite 
              ? "bg-rose-500 text-white border-rose-500 shadow-rose-500/20" 
              : "bg-white/90 text-slate-400 hover:text-rose-500 border border-slate-100 hover:bg-white"
          }`}
        >
          <Heart size={15} className="transition-transform" fill={isFavorite ? "currentColor" : "none"} />
        </motion.button>
      </div>

      {/* TEXT DATA SPECIFICATION */}
      <div className="p-4 space-y-1.5">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">
          {product.categoryName}
        </p>
        
        <h3 className="font-bold text-[#0F172A] text-xs leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* RATING STARS AND REVIEWS SYSTEM */}
        <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
          <div className="flex text-amber-400 gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < Math.round(product.averageRating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} 
              />
            ))}
          </div>
          <span className="text-slate-400 text-[10px] font-bold ml-1">({product.reviewCount || 0})</span>
        </div>

        {/* PRICING AND ACTION ZONE */}
        <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
          <span className="text-base font-black text-[#0F172A] tracking-tight">
            {formatVND(product.price)}
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-300 border border-slate-200/40 group-hover:border-blue-600">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export { formatVND, resolveImageUrl };