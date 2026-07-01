import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

// Danh sách icon giả lập tương ứng với các danh mục phổ biến để tăng tính trực quan cho giao diện
const getCategoryIcon = (name) => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("địa hình") || lowercaseName.includes("mtb")) return "⛰️";
  if (lowercaseName.includes("đua") || lowercaseName.includes("road")) return "🚴";
  if (lowercaseName.includes("thành phố") || lowercaseName.includes("touring")) return "🏙️";
  if (lowercaseName.includes("trẻ em")) return "🧸";
  if (lowercaseName.includes("điện") || lowercaseName.includes("trợ lực")) return "⚡";
  return "🚲";
};

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [newest, setNewest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [f, n, c] = await Promise.all([
          productService.getFeatured(),
          productService.getNewest(),
          categoryService.getAll(),
        ]);
        setFeatured(f.data);
        setNewest(n.data);
        setCategories(c.data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* 1. Hero Section - Thiết kế thời thượng, chiều sâu bất đối xứng */}
      <section className="relative bg-slate-900 text-white overflow-hidden min-h-[480px] sm:min-h-[560px] flex items-center">
        {/* Background Pattern hình khối kỹ thuật số đan chéo */}
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, transparent, transparent 50px, #a3e635 50px, #a3e635 52px)",
          }}
        />
        {/* Điểm nhấn ánh sáng gradient mờ ảo phía góc */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-500/10 blur-[120px] rounded-full pointer-events-none -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -ml-20 -mb-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 relative z-10 w-full">
          <p className="text-lime-400 font-extrabold tracking-[0.25em] text-xs sm:text-sm uppercase mb-4 drop-shadow-sm">
            Hệ thống xe đạp chuyên nghiệp
          </p>
          <h1 className="font-black text-4xl sm:text-6xl leading-[1.15] max-w-3xl tracking-tight text-white">
            ĐẠP NHANH HƠN.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
              ĐI XA HƠN.
            </span>
          </h1>
          <p className="text-slate-300 mt-6 max-w-xl text-sm sm:text-base leading-relaxed font-medium opacity-90">
            Từ đường đua tốc độ chuẩn quốc tế đến những cung đường off-road gồ ghề, BikeShop mang đến những chiếc xe được tinh tuyển kỹ lưỡng từ các thương hiệu hàng đầu thế giới.
          </p>
          <div className="mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-lime-400 to-lime-500 text-slate-900 font-black px-8 py-3.5 rounded-xl shadow-lg shadow-lime-500/20 hover:shadow-lime-500/30 hover:-translate-y-0.5 transition-all duration-200 text-sm tracking-wide"
            >
              Khám phá ngay <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Categories Section - Dạng thẻ bo tròn hiện đại có kèm Icon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span className="w-1 h-6 bg-slate-900 rounded-full" />
            Danh mục xe đạp
          </h2>
        </div>
        {loading ? (
          <div className="py-6"><Loader small /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?categoryId=${cat.id}`}
                className="group bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:border-lime-500/50 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl group-hover:bg-lime-50 transition-colors duration-300">
                  {getCategoryIcon(cat.name)}
                </div>
                <p className="font-bold text-slate-700 text-xs sm:text-sm group-hover:text-slate-900 transition-colors">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 3. Featured Products Section - Đổ grid cân đối */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between mb-8 border-b border-slate-100 pb-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full" />
            Sản phẩm nổi bật
          </h2>
          <Link 
            to="/products" 
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            Xem tất cả <span className="text-xs">→</span>
          </Link>
        </div>
        {loading ? (
          <div className="py-12"><Loader /></div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Newest Products Section - Sắc nét, đồng bộ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 mb-16">
        <div className="flex items-end justify-between mb-8 border-b border-slate-100 pb-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span className="w-1 h-6 bg-rose-500 rounded-full" />
            Bộ sưu tập mới về
          </h2>
        </div>
        {loading ? (
          <div className="py-12"><Loader /></div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}