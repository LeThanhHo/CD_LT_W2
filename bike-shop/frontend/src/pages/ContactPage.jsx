import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import contactService from "../services/contactService";

const emptyForm = { fullname: "", email: "", phone: "", message: "" };

export default function ContactPage() {
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactService.submit(form);
      toast.success("Đã gửi liên hệ thành công! Shop sẽ phản hồi sớm nhất.");
      setSubmitted(true);
      setForm(emptyForm);
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể gửi liên hệ, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl text-ink mb-2">Liên hệ với chúng tôi</h1>
      <p className="text-steel mb-8">
        Có thắc mắc về sản phẩm, đơn hàng hay bảo hành? Để lại lời nhắn, đội ngũ BikeShop sẽ liên hệ lại sớm nhất.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Họ và tên</label>
            <input
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Số điện thoại</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Nội dung</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Bạn cần hỗ trợ gì?"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ember text-white font-semibold py-2.5 rounded-md hover:brightness-95 transition disabled:opacity-60"
          >
            {submitting ? "Đang gửi..." : "Gửi liên hệ"}
          </button>
          {submitted && (
            <p className="text-sm text-green-600 text-center">
              Cảm ơn bạn! Chúng tôi đã nhận được lời nhắn.
            </p>
          )}
        </form>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-ink mb-3">Thông tin cửa hàng</h3>
            <p className="text-sm text-steel mb-2">📍 123 Nguyễn Huệ, Quận 1, TP.HCM</p>
            <p className="text-sm text-steel mb-2">📞 0900 000 000</p>
            <p className="text-sm text-steel mb-2">✉️ support@bikeshop.vn</p>
            <p className="text-sm text-steel">🕒 8:00 - 21:00, tất cả các ngày trong tuần</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-ink mb-3">Bạn cũng có thể</h3>
            <p className="text-sm text-steel">
              Sử dụng khung chat trợ lý ở góc phải màn hình để được tư vấn nhanh về sản phẩm, giá cả
              và chính sách giao hàng ngay lập tức.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
