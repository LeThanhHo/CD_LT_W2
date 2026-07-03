import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import productService from "../services/productService";
import reviewService from "../services/reviewService";
import { addToCart } from "../context/cartSlice";
import { formatVND, resolveImageUrl } from "../components/ProductCard";
import Loader from "../components/Loader";

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
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [canReview, setCanReview] = useState(false);

  const loadReviews = useCallback(async () => {
    const res = await reviewService.getByProduct(id);
    setReviews(res.data);
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

  useEffect(() => {
    setLoading(true);
    Promise.all([productService.getById(id), loadReviews(), loadCanReview()])
      .then(([p]) => {
        setProduct(p.data);
        setActiveImage(p.data.image);
      })
      .finally(() => setLoading(false));
    setQuantity(1);
    if (location.hash !== "#reviews") {
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated]);

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
      toast.success("Đã thêm vào giỏ hàng");
    } catch (err) {
      toast.error(err?.message || "Không thể thêm vào giỏ hàng");
    }
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
      toast.success("Cảm ơn bạn đã đánh giá!");
      setReviewForm({ rating: 5, comment: "" });
      setCanReview(false);
      await loadReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể gửi đánh giá");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader />;
  if (!product) return <p className="text-center py-16 text-steel">Không tìm thấy sản phẩm.</p>;

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const outOfStock = product.status === "OUT_OF_STOCK" || product.quantity === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-steel mb-6">
        <Link to="/" className="hover:text-ember">Trang chủ</Link> /{" "}
        <Link to="/products" className="hover:text-ember">Sản phẩm</Link> /{" "}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={resolveImageUrl(activeImage) || "https://placehold.co/600x600?text=Bike"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-3 mt-4">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                    activeImage === img ? "border-ember" : "border-transparent"
                  }`}
                >
                  <img src={resolveImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs uppercase tracking-wide text-steel font-semibold mb-2">
            {product.brandName} · {product.categoryName}
          </p>
          <h1 className="font-display text-2xl md:text-3xl text-ink mb-3">{product.name}</h1>

          <div className="flex items-center gap-2 text-amber-500 mb-4">
            {"★".repeat(Math.round(product.averageRating || 0))}
            {"☆".repeat(5 - Math.round(product.averageRating || 0))}
            <span className="text-steel text-sm">({product.reviewCount || 0} đánh giá)</span>
          </div>

          <p className="text-3xl font-bold text-ember mb-6">{formatVND(product.price)}</p>

          <p className="text-steel leading-relaxed mb-6 whitespace-pre-line">{product.description}</p>

          <p className="text-sm mb-4">
            Tình trạng:{" "}
            {outOfStock ? (
              <span className="text-red-500 font-semibold">Hết hàng</span>
            ) : (
              <span className="text-green-600 font-semibold">Còn {product.quantity} sản phẩm</span>
            )}
          </p>

          {!outOfStock && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 text-lg text-steel hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}
                  className="w-9 h-9 text-lg text-steel hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-ember text-white font-semibold py-2.5 rounded-md hover:brightness-95 transition"
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section id="reviews" className="mt-16 max-w-3xl">
        <h2 className="font-display text-xl text-ink mb-6">Đánh giá sản phẩm</h2>

        {isAuthenticated && canReview && (
          <form onSubmit={handleReviewSubmit} className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
            <p className="font-semibold text-sm text-ink mb-2">Viết đánh giá của bạn</p>
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  className={`text-2xl ${star <= reviewForm.rating ? "text-amber-500" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-ember"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="bg-ink text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-black disabled:opacity-60"
            >
              {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </form>
        )}

        {!isAuthenticated && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8 text-sm text-steel">
            <Link to="/login" className="text-ember font-semibold hover:underline">
              Đăng nhập
            </Link>{" "}
            và mua sản phẩm này để có thể để lại đánh giá.
          </div>
        )}

        {isAuthenticated && !canReview && alreadyReviewed && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8 text-sm text-steel">
            Bạn đã đánh giá sản phẩm này. Cảm ơn bạn đã chia sẻ trải nghiệm!
          </div>
        )}

        {isAuthenticated && !canReview && !alreadyReviewed && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8 text-sm text-steel">
            Bạn cần mua và nhận sản phẩm này thành công trước khi có thể đánh giá.
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-steel text-sm">Chưa có đánh giá nào cho sản phẩm này.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-ink text-sm">{r.userFullname}</p>
                  <p className="text-xs text-steel">
                    {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="text-amber-500 text-sm mb-1">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </div>
                <p className="text-sm text-steel">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
