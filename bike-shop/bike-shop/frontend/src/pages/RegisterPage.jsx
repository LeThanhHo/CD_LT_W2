import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import authService from "../services/authService";
import { setCredentials } from "../context/authSlice";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullname: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.register(form);
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      toast.success("Đăng ký thành công!");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng ký thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="font-display text-2xl text-ink mb-1">Tạo tài khoản</h1>
        <p className="text-sm text-steel mb-6">Tham gia BikeShop để mua sắm dễ dàng hơn</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-ink mb-1">Họ và tên</label>
            <input name="fullname" value={form.fullname} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Tên đăng nhập</label>
            <input name="username" value={form.username} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Mật khẩu</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Số điện thoại</label>
            <input name="phone" value={form.phone} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-ink mb-1">Địa chỉ</label>
            <input name="address" value={form.address} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-ember text-white font-semibold py-2.5 rounded-md hover:brightness-95 disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        <p className="text-sm text-steel mt-6 text-center">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-ember font-semibold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
