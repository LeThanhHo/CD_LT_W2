import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import orderService from "../services/orderService";
import { fetchCart, clearCartState } from "../context/cartSlice";
import { formatVND, resolveImageUrl } from "../components/ProductCard";
import Loader from "../components/Loader";

const paymentMethods = [
  { value: "COD", label: "Thanh toán khi nhận hàng (COD)" },
  { value: "BANK_TRANSFER", label: "Chuyển khoản ngân hàng" },
  { value: "CREDIT_CARD", label: "Thẻ tín dụng / ghi nợ" },
  { value: "MOMO", label: "Ví MoMo" },
  { value: "VNPAY", label: "VNPay" },
];

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, loading } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    receiverName: user?.fullname || "",
    receiverPhone: user?.phone || "",
    shippingAddress: user?.address || "",
    paymentMethod: "COD",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống");
      return;
    }
    setSubmitting(true);
    try {
      const res = await orderService.create(form);
      dispatch(clearCartState());
      toast.success("Đặt hàng thành công!");
      navigate(`/orders`);
      void res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Đặt hàng thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl text-ink mb-6">Thanh toán</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-ink mb-2">Thông tin nhận hàng</h3>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">Họ và tên người nhận</label>
            <input
              name="receiverName"
              value={form.receiverName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">Số điện thoại</label>
            <input
              name="receiverPhone"
              value={form.receiverPhone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">Địa chỉ giao hàng</label>
            <textarea
              name="shippingAddress"
              value={form.shippingAddress}
              onChange={handleChange}
              required
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">Ghi chú (tùy chọn)</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember"
            />
          </div>

          <div>
            <h3 className="font-semibold text-ink mb-2 mt-4">Phương thức thanh toán</h3>
            <div className="space-y-2">
              {paymentMethods.map((pm) => (
                <label
                  key={pm.value}
                  className={`flex items-center gap-3 border rounded-md px-3 py-2.5 cursor-pointer text-sm ${
                    form.paymentMethod === pm.value
                      ? "border-ember bg-orange-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.value}
                    checked={form.paymentMethod === pm.value}
                    onChange={handleChange}
                  />
                  {pm.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 h-fit">
          <h3 className="font-semibold text-ink mb-4">Đơn hàng của bạn</h3>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={resolveImageUrl(item.productImage) || "https://placehold.co/60x60?text=Bike"}
                  alt=""
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink line-clamp-1">{item.productName}</p>
                  <p className="text-xs text-steel">SL: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-ink">{formatVND(item.subTotal)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-ink text-lg border-t border-gray-200 pt-4 mb-6">
            <span>Tổng cộng</span>
            <span className="text-ember">{formatVND(totalPrice)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting || items.length === 0}
            className="w-full bg-ember text-white font-semibold py-2.5 rounded-md hover:brightness-95 transition disabled:opacity-60"
          >
            {submitting ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        </div>
      </form>
    </div>
  );
}
