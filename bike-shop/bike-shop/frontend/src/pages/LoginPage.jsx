import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import authService from "../services/authService";
import { setCredentials } from "../context/authSlice";
import { fetchCart } from "../context/cartSlice";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(form);
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      dispatch(fetchCart());
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="font-display text-2xl text-ink mb-1">Đăng nhập</h1>
        <p className="text-sm text-steel mb-6">Chào mừng quay lại BikeShop</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Tên đăng nhập</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ember text-white font-semibold py-2.5 rounded-md hover:brightness-95 disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <p className="text-sm text-steel mt-6 text-center">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-ember font-semibold hover:underline">
            Đăng ký ngay
          </Link>
        </p>

        <div className="mt-6 p-3 bg-gray-50 rounded-md text-xs text-steel">
          Demo: admin/admin123 (Admin) · customer1/123456 (Khách hàng)
        </div>
      </div>
    </div>
  );
}
