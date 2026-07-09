// src/pages/admin/UserManagementPage.jsx
// Senior UI/UX Redesign - High-End User Directory & Identity Management (shadcn/ui layout)
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  ShieldAlert, 
  UserCheck, 
  User, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  Phone, 
  MapPin, 
  Shield 
} from "lucide-react";
import userService from "../../services/userService";
import Loader from "../../components/Loader";

const roleStyles = {
  ADMIN: "bg-purple-50 text-purple-700 border-purple-200/50",
  STAFF: "bg-blue-50 text-blue-700 border-blue-200/50",
  CUSTOMER: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
};

const roleLabels = {
  ADMIN: "Quản trị viên",
  STAFF: "Nhân viên",
  CUSTOMER: "Khách hàng",
};

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  // State phụ trợ tối ưu hóa UI/UX: Tìm kiếm, Lọc quyền hạn, Phân trang và Delete Modal
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAll();
      setUsers(res.data || []);
    } catch (err) {
      toast.error("Không thể tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openEdit = (u) => {
    setEditingUser(u);
    setForm({
      fullname: u.fullname,
      email: u.email,
      phone: u.phone || "",
      address: u.address || "",
      role: u.role,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.update(editingUser.id, form);
      toast.success("Đã cập nhật thông tin thành viên");
      setShowModal(false);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const triggerDeleteConfirm = (id) => {
    setDeleteTargetId(id);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await userService.delete(deleteTargetId);
      toast.success("Đã vô hiệu hóa tài khoản thành công");
      setDeleteTargetId(null);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể thực thi thao tác");
    } finally {
      setDeleteTargetId(null);
    }
  };

  // Logic lọc dữ liệu phân tầng nâng cao (Role + Search Query)
  const filteredUsers = users
    .filter((u) => (selectedRoleFilter === "ALL" ? true : u.role === selectedRoleFilter))
    .filter((u) => {
      const text = searchQuery.toLowerCase();
      return (
        u.fullname.toLowerCase().includes(text) ||
        u.username.toLowerCase().includes(text) ||
        u.email.toLowerCase().includes(text) ||
        (u.phone && u.phone.includes(text))
      );
    });

  // Logic phân trang Client-side mượt mà
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* 🎯 1. PREMIUM HEADER CONTROL ZONE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Danh bạ thành viên</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý định danh người dùng, cấp quyền quản trị và giám sát trạng thái tài khoản hệ thống.</p>
        </div>
      </div>

      {/* 🎯 2. INTERACTIVE CONTROLS BAR (shadcn/ui style split search) */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 border border-slate-200/60 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Tìm theo họ tên, tên đăng nhập, địa chỉ email, số điện thoại..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
          />
        </div>
        <div className="relative inline-flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />
          <select
            value={selectedRoleFilter}
            onChange={(e) => { setSelectedRoleFilter(e.target.value); setCurrentPage(1); }}
            className="bg-transparent border-none text-xs text-slate-600 focus:outline-none pr-6 py-2 cursor-pointer appearance-none font-semibold"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
            <option value="STAFF">Nhân viên (STAFF)</option>
            <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
          </select>
        </div>
      </div>

      {/* 🎯 3. MAIN IDENTITY TABLE & EMPTY STATE */}
      {currentItems.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-16 text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy thành viên</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">Hệ thống danh bạ chưa ghi nhận tài khoản nào khớp với bộ lọc dữ liệu.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50/70 border-b border-slate-200/60 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Họ tên thành viên</th>
                  <th className="px-5 py-3.5">Tên đăng nhập</th>
                  <th className="px-5 py-3.5">Địa chỉ Email</th>
                  <th className="px-5 py-3.5">Số điện thoại</th>
                  <th className="px-5 py-3.5">Vai trò hệ thống</th>
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {currentItems.map((u, idx) => (
                  <motion.tr 
                    key={u.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.02 }}
                    className="hover:bg-slate-50/50 transition duration-150 group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        {/* 🎯 PREMIUM AVATAR SPECIFICATION */}
                        <div className="w-9 h-9 bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-600 font-bold border border-slate-200 rounded-xl flex items-center justify-center shadow-2xs group-hover:scale-105 transition duration-200">
                          {u.fullname ? u.fullname.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                        </div>
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">{u.fullname}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 font-mono">@{u.username}</td>
                    <td className="px-5 py-4 text-slate-500">{u.email}</td>
                    <td className="px-5 py-4 text-slate-500">{u.phone || <span className="text-slate-300 italic">Chưa cập nhật</span>}</td>
                    <td className="px-5 py-4">
                      {/* 🎯 ROLE BADGE SPECIFICATION */}
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${roleStyles[u.role]}`}>
                        {roleLabels[u.role] || u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                      <button 
                        onClick={() => openEdit(u)} 
                        className="p-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition inline-flex items-center"
                        title="Cấp lại vai trò & Thông tin"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => triggerDeleteConfirm(u.id)} 
                        className="p-1.5 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded-lg text-slate-400 hover:text-red-600 transition inline-flex items-center"
                        title="Vô hiệu hóa tài khoản"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🎯 4. MINIMAL PAGINATION CONTROLS CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 bg-slate-50/50">
              <span className="text-xs text-slate-400">Trang <span className="font-bold text-slate-700">{currentPage}</span> trên <span className="font-bold text-slate-700">{totalPages}</span></span>
              <div className="flex gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition inline-flex items-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                      currentPage === i + 1 ? "bg-blue-600 text-white shadow-sm shadow-blue-500/10" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition inline-flex items-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🎯 5. FORM MODAL (IDENTITY CONFIGURATION) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 p-4 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setShowModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 border border-slate-200/60"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Cấu hình phân quyền tài khoản
                </h2>
                <button className="text-slate-400 hover:text-slate-600 p-1" onClick={() => setShowModal(false)}><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 font-medium text-slate-700">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Họ và tên thành viên</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={form.fullname}
                      onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Địa chỉ Email</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Số điện thoại</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Vai trò vận hành</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition cursor-pointer font-bold text-blue-600"
                    >
                      <option value="ADMIN">ADMIN (Quản trị viên)</option>
                      <option value="STAFF">STAFF (Nhân viên)</option>
                      <option value="CUSTOMER">CUSTOMER (Khách hàng)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Địa chỉ thường trú</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <textarea
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition disabled:opacity-60 shadow-md shadow-blue-600/10"
                  >
                    {saving ? "Hệ thống đang lưu..." : "Cập nhật thành viên"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🎯 6. PREMIUM SHADCN/UI STYLE DELETE MODAL */}
      <AnimatePresence>
        {deleteTargetId && (
          <div className="fixed inset-0 z-50 p-4 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs" 
              onClick={() => setDeleteTargetId(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl relative z-10 border border-slate-200/80 text-center flex flex-col items-center"
            >
              <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-full flex items-center justify-center text-red-500 mb-3.5 shadow-sm">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Xác nhận xóa thành viên?</h3>
              <p className="text-xs text-slate-400 mt-1 px-2 leading-relaxed">
                Hành động này sẽ gỡ vĩnh viễn quyền truy cập của tài khoản khỏi hệ thống website cửa hàng.
              </p>
              <div className="flex gap-2 w-full mt-5">
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(null)}
                  className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-500 rounded-xl transition"
                >
                  Hủy quay lại
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/10 transition"
                >
                  Xác nhận xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}