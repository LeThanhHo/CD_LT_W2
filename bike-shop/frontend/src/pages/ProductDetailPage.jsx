// src/pages/ProductDetailPage.jsx
// Senior UI/UX Redesign - Premium Architectural Gallery Specification (Canyon & Apple Vibe)
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  ThumbsUp, 
  Star, 
  ShoppingCart, 
  ChevronRight, 
  ShieldCheck, 
  Package, 
  Camera, 
  X, 
  CheckCircle2, 
  MessageSquare,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import productService from "../services/productService";
import reviewService from "../services/reviewService";
import uploadService from "../services/uploadService";
import favoriteService from "../services/favoriteService";
import { addToCart } from "../context/cartSlice";
import { formatVND, resolveImageUrl } from "../components/ProductCard";
import Loader from "../components/Loader";

const emptyReviewForm = { rating: 5, comment: "", images: [] };

export default function ProductDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState(emptyReviewForm);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [uploadingReviewImage, setUploadingReviewImage] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);
  const [likingId, setLikingId] = useState(null);

  const loadReviews = useCallback(async () => {
    const res = await reviewService.getByProduct(id);
    setReviews(res.data || []);
    return res.data;
  }, [id]);

  const loadCanReview = useCallback(async () => {
    if (!isAuthenticated) {
      setCanReview(false);
      return;
    }
    try {
      const res = await reviewService.canReview(id);
      setCanReview(res.data);
    } catch (err) {
      console.error("Không thể kiểm tra điều kiện đánh giá:", err);
      setCanReview(false);
    }
  }, [id, isAuthenticated]);

  const loadFavoriteStatus = useCallback(async () => {
    if (!isAuthenticated) {
      setIsFavorite(false);
      return;
    }
    try {
      const res = await favoriteService.isFavorite(id);
      setIsFavorite(res.data);
    } catch {
      setIsFavorite(false);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    setLoading(true);
    Promise.all([productService.getById(id), loadReviews(), loadCanReview(), loadFavoriteStatus()])
      .then(([p]) => {
        setProduct(p.data);
        setActiveImage(p.data?.image);
      })
      .catch((err) => toast.error("Lỗi đồng bộ chi tiết thiết bị"))
      .finally(() => setLoading(false));
    setQuantity(1);
    if (location.hash !== "#reviews") {
      window.scrollTo(0, 0);
    }
  }, [id, isAuthenticated, loadReviews, loadCanReview, loadFavoriteStatus]);

  useEffect(() => {
    if (!loading && location.hash === "#reviews") {
      const el = document.getElementById("reviews");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading, location.hash]);

  const alreadyReviewed = reviews.some((r) => r.userId === user?.id);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }
    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
      toast.success("Đã thêm siêu xe vào giỏ hàng");
    } catch (err) {
      toast.error(err?.message || "Không thể thêm vào giỏ hàng");
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để lưu sản phẩm yêu thích");
      return;
    }
    if (favoriteBusy) return;
    setFavoriteBusy(true);
    try {
      if (isFavorite) {
        await favoriteService.remove(id);
        setIsFavorite(false);
        toast.success("Đã bỏ yêu thích");
      } else {
        await favoriteService.add(id);
        setIsFavorite(true);
        toast.success("Đã thêm vào bộ sưu tập yêu thích");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setFavoriteBusy(false);
    }
  };

  const handleReviewImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingReviewImage(true);
    try {
      const res = await uploadService.uploadImage(file);
      setReviewForm((prev) => ({ ...prev, images: [...prev.images, res.data.url] }));
      toast.success("Đã đính kèm ảnh thực tế");
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể tải ảnh lên");
    } finally {
      setUploadingReviewImage(false);
      e.target.value = "";
    }
  };

  const handleRemoveReviewImage = (url) => {
    setReviewForm((prev) => ({ ...prev, images: prev.images.filter((i) => i !== url) }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để đánh giá");
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewService.create(id, reviewForm);
      toast.success("Cảm ơn bạn đã chia sẻ trải nghiệm quý giá!");
      setReviewForm(emptyReviewForm);
      setCanReview(false);
      await loadReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể gửi đánh giá");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleToggleLike = async (reviewId) => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để tương tác");
      return;
    }
    setLikingId(reviewId);
    try {
      const res = await reviewService.toggleLike(reviewId);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, likeCount: res.data.likeCount, likedByMe: res.data.likedByMe } : r))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLikingId(null);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader /></div>;
  if (!product) return <div className="text-center py-24 font-sans text-slate-400 font-medium">Không tìm thấy mã sản phẩm xe đạp hợp lệ.</div>;

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const outOfStock = product.status === "OUT_OF_STOCK" || product.quantity === 0;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 font-sans text-slate-900">
      
      {/* 🎯 1. MINIMALIST APPLE BREADCRUMBS BREADCRUMBS */}
      <nav className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-8">
        <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <Link to="/products" className="hover:text-blue-600 transition-colors">Kho hàng sản phẩm</Link>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-600 truncate max-w-[200px] font-extrabold normal-case">{product.name}</span>
      </nav>

      {/* 🎯 2. CANVAS CORE STRUCTURAL GRID (Images Left / Details Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        
        {/* KHỐI TRÁI: THƯ VIỆN HÌNH ẢNH EXHIBITION */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-[#F8FAFC] border border-slate-200/50 rounded-2xl overflow-hidden flex items-center justify-center p-6 shadow-2xs group/canvas">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              src={resolveImageUrl(activeImage) || "https://placehold.co/600x600?text=Bike"}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Nút lưu yêu thích nảy vật lý */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleToggleFavorite}
              aria-label="Yêu thích"
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md border transition-all duration-300 ${
                isFavorite 
                  ? "bg-rose-500 border-rose-500 text-white shadow-rose-500/20" 
                  : "bg-white/95 border-slate-100 text-slate-400 hover:text-rose-500"
              }`}
            >
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            </motion.button>
          </div>

          {/* Dải hình ảnh lưới thu nhỏ dạng thẻ */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 custom-scrollbar">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-xl bg-[#F8FAFC] overflow-hidden border-2 shrink-0 p-1 flex items-center justify-center transition-all ${
                    activeImage === img ? "border-blue-600 shadow-sm shadow-blue-500/10" : "border-slate-200/60 hover:border-slate-300"
                  }`}
                >
                  <img src={resolveImageUrl(img)} alt="" className="max-w-full max-h-full object-contain rounded-md" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* KHỐI PHẢI: CHI TIẾT THÔNG SỐ VÀ ĐIỀU HÀNH THƯƠNG MẠI */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest border border-slate-200/40 shadow-3xs">
              {product.brandName || "Thương hiệu mở"} · {product.categoryName}
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase">
              {product.name}
            </h1>

            {/* Khối rating tổng hợp */}
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xs pt-1">
              <div className="flex text-amber-400 gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.averageRating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                ))}
              </div>
              <span className="text-slate-400 font-semibold">({product.reviewCount || 0} Rider phản hồi)</span>
            </div>
          </div>

          <div className="py-4 border-y border-slate-200/60 flex items-baseline gap-4">
            <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
              {formatVND(product.price)}
            </span>
          </div>

          {/* Mô tả thông số phẳng */}
          <div className="text-xs text-slate-500 font-medium leading-relaxed bg-slate-50/50 p-4 border border-slate-200/60 rounded-2xl whitespace-pre-line shadow-3xs">
            {product.description || <span className="italic text-slate-300">Chưa có thông số mô tả cụ thể cho phiên bản cấu hình này.</span>}
          </div>

          {/* Tình trạng kho hàng */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-slate-400 uppercase tracking-wider">Trạng thái kho:</span>
            {outOfStock ? (
              <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-md text-[11px]"><AlertCircle className="w-3.5 h-3.5" /> Hết hàng tạm thời</span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md text-[11px]"><CheckCircle2 className="w-3.5 h-3.5" /> Sẵn sàng giao (Còn {product.quantity} chiếc)</span>
            )}
          </div>

          {/* BẢNG ĐIỀU KHIỂN SỐ LƯỢNG VÀ THÊM GIỎ HÀNG */}
          {!outOfStock && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 shrink-0 h-11 justify-between sm:justify-start">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-full text-sm font-bold text-slate-500 hover:bg-white rounded-lg transition"
                >
                  −
                </button>
                <span className="w-10 text-center font-bold text-xs text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}
                  className="w-9 h-full text-sm font-bold text-slate-500 hover:bg-white rounded-lg transition"
                >
                  +
                </button>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider h-11 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-600/10 transition"
              >
                <ShoppingCart className="w-4 h-4" /> Thêm vào giỏ hàng
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* 🎯 3. PRESTIGE REVIEWS CORE SECTION */}
      <section id="reviews" className="mt-20 border-t border-slate-200/60 pt-12 max-w-4xl">
        <div className="flex items-center gap-2 mb-8">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">Phản hồi thực tế từ các Rider</h2>
        </div>

        {/* CÁC ĐIỀU KIỆN TRẠNG THÁI FORM BÌNH LUẬN KHÁCH HÀNG */}
        {isAuthenticated && canReview && (
          <motion.form 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleReviewSubmit} 
            className="bg-white border border-slate-200/70 rounded-2xl p-5 md:p-6 shadow-2xs mb-10 space-y-4 font-medium text-slate-700"
          >
            <p className="font-bold text-xs text-slate-500 uppercase tracking-wider">Gửi nhận xét của bạn</p>
            
            {/* Chọn rating sao tương tác */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  className="text-xl transition-transform hover:scale-110 p-0.5 focus:outline-none"
                >
                  <Star className={`w-6 h-6 ${star <= reviewForm.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                </button>
              ))}
            </div>

            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Chia sẻ cảm nhận chi tiết của bạn về phuộc nhún, bộ truyền động, trọng lượng khung sườn..."
              rows={4}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition custom-scrollbar"
            />

            {/* Preview dải ảnh feedback muốn đăng */}
            {reviewForm.images.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {reviewForm.images.map((url) => (
                  <div key={url} className="relative w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-3xs p-0.5 group/thumb">
                    <img src={resolveImageUrl(url)} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => handleRemoveReviewImage(url)}
                      className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-slate-900 text-white rounded-full text-[9px] flex items-center justify-center shadow-md hover:bg-red-600 transition"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Custom nút đính kèm ảnh local đẹp */}
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 font-bold cursor-pointer transition shadow-3xs">
                <Camera className="w-3.5 h-3.5 text-slate-400" />
                Đính kèm ảnh thực tế
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleReviewImageSelect}
                  disabled={uploadingReviewImage}
                  className="hidden"
                />
              </label>
              {uploadingReviewImage && <span className="text-[11px] text-slate-400 animate-pulse font-semibold">Đang xử lý ảnh đẩy lên...</span>}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={submittingReview || uploadingReviewImage}
                className="bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition disabled:opacity-60 shadow-md shadow-slate-900/10"
              >
                {submittingReview ? "Đang xuất bản..." : "Gửi đánh giá chính thức"}
              </button>
            </div>
          </motion.form>
        )}

        {/* BOX CẢNH BÁO CHƯA ĐĂNG NHẬP */}
        {!isAuthenticated && (
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center gap-2.5 text-xs font-semibold text-slate-500 mb-8 shadow-3xs">
            <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Vui lòng <Link to="/login" className="text-blue-600 font-extrabold hover:underline">Đăng nhập tài khoản</Link> và hoàn tất mua dòng sản phẩm này để có thể xuất bản đánh giá kiểm duyệt.</span>
          </div>
        )}

        {/* BOX ĐÃ ĐÁNH GIÁ RỒI */}
        {isAuthenticated && !canReview && alreadyReviewed && (
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex items-center gap-2.5 text-xs font-semibold text-emerald-700 mb-8 shadow-3xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Hệ thống ghi nhận bạn đã để lại nhận xét cho sản phẩm xe này. BikeShop chân thành cảm ơn đóng góp của bạn!</span>
          </div>
        )}

        {/* BOX CHƯA ĐỦ ĐIỀU KIỆN MUA */}
        {isAuthenticated && !canReview && !alreadyReviewed && (
          <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 flex items-center gap-2.5 text-xs font-semibold text-amber-700 mb-8 shadow-3xs">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Tài khoản của bạn cần sở hữu và nhận thành công kiện hàng xe đạp này để mở khóa tính năng viết feedback.</span>
          </div>
        )}

        {/* DANH SÁCH FEEDBACK REVIEWS LIST */}
        {reviews.length === 0 ? (
          <div className="py-6 text-slate-400 text-xs font-medium italic">Chưa ghi nhận đánh giá chuyên sâu nào từ các Rider cho mã sản phẩm này.</div>
        ) : (
          <div className="space-y-6">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-slate-100 pb-6 last:border-b-0 space-y-2.5 font-medium text-slate-700">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    {/* Avatar tròn mượt mà */}
                    <div className="w-8 h-8 bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-600 font-bold text-xs rounded-full flex items-center justify-center border border-slate-200/50 shadow-3xs uppercase">
                      {r.userFullname ? r.userFullname.charAt(0) : "R"}
                    </div>
                    <p className="font-bold text-slate-900 text-sm leading-none">{r.userFullname}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                
                {/* Sao điểm số */}
                <div className="flex text-amber-400 gap-0.5">
                  {"★".repeat(r.rating)}
                  <span className="text-slate-200">{"★".repeat(5 - r.rating)}</span>
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">{r.comment}</p>

                {/* Ảnh đính kèm feedback */}
                {r.images && r.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {r.images.map((img, i) => (
                      <div key={i} className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-0.5 shadow-3xs hover:scale-103 transition duration-150 cursor-zoom-in">
                        <img src={resolveImageUrl(img)} alt="" className="w-full h-full object-cover rounded-lg" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Nút thích hữu ích nảy rung */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleToggleLike(r.id)}
                  disabled={likingId === r.id}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all ${
                    r.likedByMe 
                      ? "bg-blue-50 text-blue-700 border-blue-200/60" 
                      : "bg-slate-50/50 border-slate-200/60 text-slate-400 hover:text-blue-600 hover:bg-white"
                  }`}
                >
                  <ThumbsUp size={12} fill={r.likedByMe ? "currentColor" : "none"} />
                  Hữu ích ({r.likeCount || 0})
                </motion.button>

                {/* Phản hồi từ quản trị hệ thống shop */}
                {r.reply && (
                  <div className="bg-blue-50/40 border border-blue-100/60 rounded-xl p-3.5 pl-4 ml-2 border-l-2 border-l-blue-500 relative overflow-hidden">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Phản hồi chính thức từ BikeShop:</p>
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed">“ {r.reply} ”</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}