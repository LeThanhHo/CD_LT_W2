import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchCart, updateCartItem, removeCartItem } from "../context/cartSlice";
import { formatVND, resolveImageUrl } from "../components/ProductCard";
import Loader from "../components/Loader";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ itemId, quantity })).catch(() =>
      toast.error("Không thể cập nhật số lượng")
    );
  };

  const handleRemove = (itemId) => {
    dispatch(removeCartItem(itemId))
      .unwrap()
      .then(() => toast.success("Đã xóa sản phẩm khỏi giỏ hàng"))
      .catch(() => toast.error("Không thể xóa sản phẩm"));
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-steel mb-4">Vui lòng đăng nhập để xem giỏ hàng của bạn.</p>
        <Link to="/login" className="bg-ember text-white font-semibold px-6 py-2.5 rounded-md">
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl text-ink mb-6">Giỏ hàng của bạn</h1>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-steel mb-4">Giỏ hàng của bạn đang trống.</p>
          <Link to="/products" className="text-ember font-semibold hover:underline">
            Tiếp tục mua sắm →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <img
                  src={resolveImageUrl(item.productImage) || "https://placehold.co/100x100?text=Bike"}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-md shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.productId}`}
                    className="font-semibold text-ink text-sm hover:text-ember line-clamp-2"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-ember font-bold mt-1">{formatVND(item.price)}</p>
                </div>
                <div className="flex items-center border border-gray-300 rounded-md shrink-0">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-8 h-8 text-steel hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 text-steel hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <p className="w-28 text-right font-semibold text-ink shrink-0">
                  {formatVND(item.subTotal)}
                </p>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-steel hover:text-red-500 shrink-0"
                  title="Xóa"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 h-fit">
            <h3 className="font-semibold text-ink mb-4">Tóm tắt đơn hàng</h3>
            <div className="flex justify-between text-sm text-steel mb-2">
              <span>Tạm tính</span>
              <span>{formatVND(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm text-steel mb-4">
              <span>Phí vận chuyển</span>
              <span>Miễn phí</span>
            </div>
            <div className="flex justify-between font-bold text-ink text-lg border-t border-gray-200 pt-4 mb-6">
              <span>Tổng cộng</span>
              <span className="text-ember">{formatVND(totalPrice)}</span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-ember text-white font-semibold py-2.5 rounded-md hover:brightness-95 transition"
            >
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
