import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import contactService from "../../services/contactService";
import Loader from "../../components/Loader";

export default function ContactManagementPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const res = await contactService.getAll();
      setContacts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleMarkProcessed = async (id) => {
    try {
      await contactService.markProcessed(id);
      toast.success("Đã đánh dấu đã xử lý");
      loadContacts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa liên hệ này?")) return;
    try {
      await contactService.delete(id);
      toast.success("Đã xóa liên hệ");
      loadContacts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa liên hệ");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Quản lý liên hệ</h1>

      {contacts.length === 0 ? (
        <p className="text-steel text-center py-16">Chưa có lời liên hệ nào.</p>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                className="w-full flex flex-wrap items-center justify-between gap-3 p-4 text-left"
              >
                <div>
                  <p className="font-semibold text-ink">{c.fullname}</p>
                  <p className="text-xs text-steel">
                    {c.email} {c.phone && `· ${c.phone}`}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    c.status === "PROCESSED"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {c.status === "PROCESSED" ? "Đã xử lý" : "Chờ xử lý"}
                </span>
                <p className="text-xs text-steel">
                  {new Date(c.createdAt).toLocaleString("vi-VN")}
                </p>
              </button>

              {expandedId === c.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <p className="text-sm text-ink whitespace-pre-line mb-4">{c.message}</p>
                  <div className="flex gap-3">
                    {c.status !== "PROCESSED" && (
                      <button
                        onClick={() => handleMarkProcessed(c.id)}
                        className="text-sm font-semibold text-green-600 hover:underline"
                      >
                        Đánh dấu đã xử lý
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-sm font-semibold text-red-500 hover:underline"
                    >
                      Xóa
                    </button>
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
