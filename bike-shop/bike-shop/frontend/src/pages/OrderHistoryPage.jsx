import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import orderService from "../services/orderService";
import { formatVND, resolveImageUrl } from "../components/ProductCard";
import Loader from "../components/Loader";

const statusStyles = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPING: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const statusLabels = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getMyOrders();
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    try {
      await orderService.cancel(id);
      toast.success("Đã hủy đơn hàng");
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể hủy đơn hàng");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl text-ink mb-6">Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-steel mb-4">Bạn chưa có đơn hàng nào.</p>
          <Link to="/products" className="text-ember font-semibold hover:underline">
            Bắt đầu mua sắm →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="w-full flex flex-wrap items-center justify-between gap-3 p-4 text-left"
              >
                <div>
                  <p className="font-semibold text-ink">Đơn hàng #{order.id}</p>
                  <p className="text-xs text-steel">
                    {new Date(order.orderDate).toLocaleString("vi-VN")}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[order.status]}`}
                >
                  {statusLabels[order.status]}
                </span>
                <p className="font-bold text-ember">{formatVND(order.totalPrice)}</p>
              </button>

              {expandedId === order.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-steel">Người nhận</p>
                      <p className="font-medium text-ink">{order.receiverName}</p>
                      <p className="text-ink">{order.receiverPhone}</p>
                    </div>
                    <div>
                      <p className="text-steel">Địa chỉ giao hàng</p>
                      <p className="font-medium text-ink">{order.shippingAddress}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.orderDetails.map((d) => (
                      <div key={d.id} className="flex items-center gap-3">
                        <img
                          src={resolveImageUrl(d.productImage) || "https://placehold.co/60x60?text=Bike"}
                          alt=""
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${d.productId}`}
                            className="text-sm text-ink font-medium line-clamp-1 hover:text-ember"
                          >
                            {d.productName}
                          </Link>
                          <p className="text-xs text-steel">SL: {d.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-ink">{formatVND(d.price * d.quantity)}</p>
                        {order.status === "COMPLETED" && (
                          <Link
                            to={`/products/${d.productId}#reviews`}
                            className="text-xs font-semibold text-ember border border-ember rounded-md px-3 py-1.5 hover:bg-orange-50 shrink-0"
                          >
                            Đánh giá
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.status === "PENDING" && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="mt-4 text-sm font-semibold text-red-500 hover:underline"
                    >
                      Hủy đơn hàng
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
