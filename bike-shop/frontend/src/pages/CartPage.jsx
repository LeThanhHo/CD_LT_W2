// src/pages/CartPage.jsx
// Senior UI/UX Redesign - Premium Cart Checkout Specification (shadcn/ui layout)
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  CreditCard, 
  ShieldCheck, 
  Truck,
  ShoppingCart
} from "lucide-react";
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
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Giỏ hàng bảo mật</h2>
        <p className="text-sm text-slate-400 mb-8 font-medium">Vui lòng đăng nhập tài khoản để xem giỏ hàng và thực hiện thanh toán an toàn.</p>
        <Link to="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition shadow-lg shadow-blue-600/10 active:scale-95">
          Đăng nhập hệ thống
        </Link>
      </div>
    );
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 font-sans text-slate-900">
      
      {/* 🎯 1. HEADER ZONE */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Giỏ hàng của bạn</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">Kiểm tra thông tin sản phẩm và tiến hành thanh toán.</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200/60 rounded-3xl shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <p className="text-sm text-slate-400 mb-6 font-medium">Giỏ hàng của bạn hiện đang trống.</p>
          <Link to="/products" className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-wider">
            Khám phá siêu xe ngay <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          
          {/* 🎯 2. LIST ITEMS FEED */}
          <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <div className="divide-y divide-slate-100">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-6 p-6 group"
                  >
                    <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={resolveImageUrl(item.productImage) || "https://placehold.co/100x100?text=Bike"}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.productId}`}
                        className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors line-clamp-2"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-xs font-black text-slate-900 mt-1.5">{formatVND(item.price)}</p>
                    </div>

                    {/* Quantity Adjustment Controller */}
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 shrink-0">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 text-slate-500 hover:text-slate-900 transition flex items-center justify-center font-bold text-sm"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 text-slate-500 hover:text-slate-900 transition flex items-center justify-center font-bold text-sm"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <p className="w-28 text-right font-black text-slate-900 text-sm shrink-0">
                      {formatVND(item.subTotal)}
                    </p>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-slate-300 hover:text-red-500 p-2 transition shrink-0"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* 🎯 3. SUMMARY CARD (STICKY SIDEBAR) */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-8 h-fit shadow-[0_4px_20px_rgba(0,0,0,0.01)] lg:sticky lg:top-24">
            <h3 className="font-black text-slate-900 text-base uppercase tracking-wider mb-6">Tóm tắt đơn hàng</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wide">
                <span>Tạm tính</span>
                <span className="text-slate-900">{formatVND(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wide">
                <span>Phí vận chuyển</span>
                <span className="text-emerald-600">Miễn phí</span>
              </div>
            </div>

            <div className="flex justify-between font-black text-slate-900 text-lg border-t border-slate-100 pt-6 mb-8">
              <span>Tổng cộng</span>
              <span>{formatVND(totalPrice)}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-300 shadow-xl shadow-blue-600/10 active:scale-95 flex items-center justify-center gap-2"
            >
              <CreditCard size={16} /> Tiến hành thanh toán
            </button>

            {/* TRUST INDICATORS */}
            <div className="mt-8 space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <ShieldCheck size={16} className="text-emerald-500" /> Thanh toán bảo mật SSL
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <Truck size={16} className="text-blue-500" /> Hỗ trợ vận chuyển toàn quốc
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}