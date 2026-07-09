import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import orderService from "../../services/orderService";
import { formatVND, resolveImageUrl } from "../../components/ProductCard";
import Loader from "../../components/Loader";

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

const statusOptions = Object.keys(statusLabels);

export default function OrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAll();
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await orderService.updateStatus(id, { status });
      toast.success("Đã cập nhật trạng thái đơn hàng");
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể cập nhật trạng thái");
    }
  };

  const filteredOrders = filterStatus ? orders.filter((o) => o.status === filterStatus) : orders;

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-display text-2xl text-ink">Quản lý đơn hàng</h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Tất cả trạng thái</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-steel text-center py-16">Không có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="w-full flex flex-wrap items-center justify-between gap-3 p-4 text-left"
              >
                <div>
                  <p className="font-semibold text-ink">
                    Đơn hàng #{order.id} · {order.userFullname}
                  </p>
                  <p className="text-xs text-steel">
                    {new Date(order.orderDate).toLocaleString("vi-VN")}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[order.status]}`}>
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
                    <div>
                      <p className="text-steel">Phương thức thanh toán</p>
                      <p className="font-medium text-ink">{order.paymentMethod}</p>
                    </div>
                    {order.note && (
                      <div>
                        <p className="text-steel">Ghi chú</p>
                        <p className="font-medium text-ink">{order.note}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    {order.orderDetails.map((d) => (
                      <div key={d.id} className="flex items-center gap-3">
                        <img
                          src={resolveImageUrl(d.productImage) || "https://placehold.co/60x60?text=Bike"}
                          alt=""
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-ink line-clamp-1">{d.productName}</p>
                          <p className="text-xs text-steel">SL: {d.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-ink">{formatVND(d.price * d.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-ink">Cập nhật trạng thái:</label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {statusLabels[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
