import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Heart } from "lucide-react";
import favoriteService from "../services/favoriteService";

const formatVND = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

// Backend serves uploaded files (e.g. "/uploads/xxxx.jpg") from its own origin,
// which differs from the frontend dev server origin — resolve to an absolute URL.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, isAuthenticated]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để lưu sản phẩm yêu thích");
      return;
    }
    if (checking) return;
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
      className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={resolveImageUrl(product.image) || "https://placehold.co/400x400?text=Bike"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {outOfStock && (
          <span className="absolute top-3 left-3 bg-ink text-white text-xs font-bold px-2 py-1 rounded">
            Hết hàng
          </span>
        )}
        {product.brandName && (
          <span className="absolute top-3 right-3 bg-white/90 text-ink text-xs font-semibold px-2 py-1 rounded">
            {product.brandName}
          </span>
        )}
        <button
          onClick={handleToggleFavorite}
          aria-label="Yêu thích"
          className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-100 ${
            isFavorite ? "bg-ember text-white" : "bg-white/90 text-steel hover:text-ember"
          }`}
        >
          <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-steel font-semibold mb-1">
          {product.categoryName}
        </p>
        <h3 className="font-semibold text-ink line-clamp-2 min-h-[2.75rem] group-hover:text-ember transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mt-2 text-sm text-amber-500">
          {"★".repeat(Math.round(product.averageRating || 0))}
          {"☆".repeat(5 - Math.round(product.averageRating || 0))}
          <span className="text-steel ml-1">({product.reviewCount || 0})</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-ember">{formatVND(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}

export { formatVND, resolveImageUrl };
