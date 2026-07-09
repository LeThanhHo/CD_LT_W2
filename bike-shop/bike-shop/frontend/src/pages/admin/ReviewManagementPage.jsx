import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import reviewService from "../../services/reviewService";
import { resolveImageUrl } from "../../components/ProductCard";
import Loader from "../../components/Loader";

export default function ReviewManagementPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewService.getAllForAdmin();
      setReviews(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleReplyChange = (reviewId, value) => {
    setReplyDrafts((prev) => ({ ...prev, [reviewId]: value }));
  };

  const handleReplySubmit = async (reviewId) => {
    const reply = (replyDrafts[reviewId] ?? "").trim();
    if (!reply) {
      toast.error("Vui lòng nhập nội dung phản hồi");
      return;
    }
    setSubmittingId(reviewId);
    try {
      await reviewService.reply(reviewId, reply);
      toast.success("Đã gửi phản hồi");
      loadReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể gửi phản hồi");
    } finally {
      setSubmittingId(null);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    try {
      await reviewService.delete(reviewId);
      toast.success("Đã xóa đánh giá");
      loadReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa đánh giá");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Quản lý đánh giá</h1>

      {reviews.length === 0 ? (
        <p className="text-steel text-center py-16">Chưa có đánh giá nào.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-semibold text-ink text-sm">{r.userFullname}</p>
                  <p className="text-xs text-steel">
                    Sản phẩm: <span className="font-medium text-ink">{r.productName}</span>
                  </p>
                </div>
                <p className="text-xs text-steel shrink-0">
                  {new Date(r.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>

              <div className="text-amber-500 text-sm mb-1">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
                <span className="text-steel ml-2">👍 {r.likeCount || 0}</span>
              </div>

              <p className="text-sm text-ink mb-2">{r.comment}</p>

              {r.images && r.images.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {r.images.map((img, i) => (
                    <img
                      key={i}
                      src={resolveImageUrl(img)}
                      alt=""
                      className="w-16 h-16 object-cover rounded-md border border-gray-200"
                    />
                  ))}
                </div>
              )}

              {r.reply ? (
                <div className="bg-orange-50 border border-orange-100 rounded-md p-3 mt-2">
                  <p className="text-xs font-semibold text-ember mb-1">Phản hồi từ shop:</p>
                  <p className="text-sm text-ink">{r.reply}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-3">
                  <input
                    value={replyDrafts[r.id] ?? ""}
                    onChange={(e) => handleReplyChange(r.id, e.target.value)}
                    placeholder="Viết phản hồi cho khách hàng..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember"
                  />
                  <button
                    onClick={() => handleReplySubmit(r.id)}
                    disabled={submittingId === r.id}
                    className="bg-ink text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-black disabled:opacity-60 shrink-0"
                  >
                    {submittingId === r.id ? "Đang gửi..." : "Trả lời"}
                  </button>
                </div>
              )}

              <div className="mt-3">
                <button
                  onClick={() => handleDelete(r.id)}
                  className="text-xs font-semibold text-red-500 hover:underline"
                >
                  Xóa đánh giá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
