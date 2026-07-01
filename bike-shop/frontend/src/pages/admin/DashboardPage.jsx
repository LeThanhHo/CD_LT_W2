import React, { useEffect, useState } from "react";
import dashboardService from "../../services/dashboardService";
import { formatVND } from "../../components/ProductCard";
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

      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-ink mb-3">Chào mừng trở lại!</h2>
        <p className="text-sm text-steel">
          Sử dụng thanh điều hướng bên trái để quản lý sản phẩm, danh mục, hãng xe, đơn hàng và
          người dùng của cửa hàng.
        </p>
      </div>
    </div>
  );
}
