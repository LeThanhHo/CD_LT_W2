import React, { useEffect, useState } from "react";
import dashboardService from "../../services/dashboardService";
import { formatVND, resolveImageUrl } from "../../components/ProductCard";
import Loader from "../../components/Loader";

const StatCard = ({ label, value, accent }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6">
    <p className="text-sm text-steel mb-2">{label}</p>
    <p className={`text-2xl font-bold ${accent || "text-ink"}`}>{value}</p>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getStats()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Tổng quan</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Tổng doanh thu" value={formatVND(stats?.totalRevenue)} accent="text-ember" />
        <StatCard label="Tổng đơn hàng" value={stats?.totalOrders ?? 0} />
        <StatCard label="Tổng sản phẩm" value={stats?.totalProducts ?? 0} />
        <StatCard label="Tổng khách hàng" value={stats?.totalCustomers ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-ink mb-4">Sản phẩm bán chạy</h2>
          {stats?.bestSellingProducts && stats.bestSellingProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.bestSellingProducts.map((p) => (
                <div key={p.productId} className="flex items-center gap-3">
                  <img
                    src={resolveImageUrl(p.productImage) || "https://placehold.co/40x40?text=Bike"}
                    alt=""
                    className="w-10 h-10 rounded-md object-cover shrink-0"
                  />
                  <p className="flex-1 text-sm text-ink line-clamp-1">{p.productName}</p>
                  <span className="text-sm font-semibold text-ember shrink-0">
                    Đã bán {p.totalSold}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-steel">Chưa có dữ liệu bán hàng.</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-ink mb-3">Khách hàng mới trong tháng</h2>
          <p className="text-3xl font-bold text-ink">{stats?.newCustomersThisMonth ?? 0}</p>
          <p className="text-sm text-steel mt-2">
            Số tài khoản khách hàng đăng ký mới kể từ đầu tháng này.
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-ink mb-3">Chào mừng trở lại!</h2>
        <p className="text-sm text-steel">
          Sử dụng thanh điều hướng bên trái để quản lý sản phẩm, danh mục, hãng xe, đơn hàng,
          đánh giá, bài viết, liên hệ và người dùng của cửa hàng.
        </p>
      </div>
    </div>
  );
}
