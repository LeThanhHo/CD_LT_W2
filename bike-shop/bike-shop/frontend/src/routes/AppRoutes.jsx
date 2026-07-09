import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import { ProtectedRoute, AdminRoute } from "../components/ProtectedRoute";
import { fetchCart } from "../context/cartSlice";

import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderHistoryPage from "../pages/OrderHistoryPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PostListPage from "../pages/PostListPage";
import PostDetailPage from "../pages/PostDetailPage";
import ContactPage from "../pages/ContactPage";
import FavoritesPage from "../pages/FavoritesPage";

import DashboardPage from "../pages/admin/DashboardPage";
import ProductManagementPage from "../pages/admin/ProductManagementPage";
import CategoryManagementPage from "../pages/admin/CategoryManagementPage";
import BrandManagementPage from "../pages/admin/BrandManagementPage";
import OrderManagementPage from "../pages/admin/OrderManagementPage";
import UserManagementPage from "../pages/admin/UserManagementPage";
import PostManagementPage from "../pages/admin/PostManagementPage";
import ContactManagementPage from "../pages/admin/ContactManagementPage";
import ReviewManagementPage from "../pages/admin/ReviewManagementPage";

function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-display text-6xl text-ink mb-4">404</p>
      <p className="text-steel">Trang bạn tìm kiếm không tồn tại.</p>
    </div>
  );
}

export default function AppRoutes() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Routes>
      {/* Public / customer-facing routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/posts" element={<PostListPage />} />
        <Route path="/posts/:slug" element={<PostDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin dashboard routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductManagementPage />} />
        <Route path="categories" element={<CategoryManagementPage />} />
        <Route path="brands" element={<BrandManagementPage />} />
        <Route path="orders" element={<OrderManagementPage />} />
        <Route path="reviews" element={<ReviewManagementPage />} />
        <Route path="posts" element={<PostManagementPage />} />
        <Route path="contacts" element={<ContactManagementPage />} />
        <Route path="users" element={<UserManagementPage />} />
      </Route>
    </Routes>
  );
}
