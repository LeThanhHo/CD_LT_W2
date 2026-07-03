import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

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
    <div className="bg-slate-50/50 min-h-screen overflow-x-hidden relative">
      
      {/* 1. HERO BANNER - KỶ NIỆM 50 NĂM THÀNH PHỐ MANG TÊN BÁC HÀO HÙNG */}
      <section className="relative bg-gradient-to-br from-red-800 via-red-700 to-amber-950 text-white overflow-hidden min-h-[520px] sm:min-h-[600px] flex items-center shadow-inner">
        
        {/* Hiệu ứng Pháo hoa lấp lánh CSS sinh động ở phông nền nền */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          <div className="firework-particle fp-1" />
          <div className="firework-particle fp-2" />
          <div className="firework-particle fp-3" />
        </div>

        {/* Điểm nhấn Ánh hào quang Sao vàng trung tâm mờ ảo tạo chiều sâu */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 blur-[130px] rounded-full pointer-events-none animate-pulse duration-[5000ms]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10 w-full text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Khối văn bản kỷ niệm chính */}
          <div className="max-w-3xl animate-fade-in-up flex-1">
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-black tracking-[0.2em] text-xs px-3.5 py-1.5 rounded-full uppercase mb-6 shadow-sm">
              🌟 1976 - 2026 • KỶ NIỆM 50 NĂM TỰ HÀO
            </div>
            
            <h1 className="font-black text-3xl sm:text-5xl lg:text-6xl leading-[1.15] tracking-tight text-white drop-shadow-md">
              HÀO HÙNG 50 NĂM
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 font-extrabold">
                THÀNH PHỐ MANG TÊN BÁC
              </span>
            </h1>
            
            <p className="text-red-100 mt-6 max-w-xl text-sm sm:text-base leading-relaxed font-medium opacity-90 mx-auto sm:mx-0">
              Chào mừng cột mốc lịch sử vàng son của Thành phố Hồ Chí Minh rực rỡ tên vàng. BikeShop tự hào đồng hành cùng tinh thần thể thao năng động, vươn tầm cao mới, xây dựng lối sống xanh, khỏe mạnh và bền vững của thế hệ tương lai.
            </p>
            
            <div className="mt-10 flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <Link
                to="/products"
                className="bg-gradient-to-r from-yellow-400 to-amber-400 text-red-950 font-black px-8 py-3.5 rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:-translate-y-0.5 active:scale-98 transition-all duration-300 text-sm tracking-wide"
              >
                Khám phá bộ sưu tập ngay <span>→</span>
              </Link>
              <Link
                to="/blog"
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold px-6 py-3.5 rounded-xl text-sm transition-all duration-300 backdrop-blur-sm"
              >
                Xem tin tức sự kiện
              </Link>
            </div>
          </div>

          {/* Khối huy hiệu hoặc hình ảnh biểu trưng 50 năm nước VNXHCN cánh phải */}
          <div className="flex justify-center items-center relative flex-shrink-0 animate-fade-in duration-1000">
            <div className="w-56 h-56 sm:w-72 sm:h-56 border-4 border-yellow-400/20 bg-gradient-to-br from-red-600 to-red-900 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-6 text-center select-none relative group overflow-hidden">
              {/* Ánh kim lướt qua khi hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <div className="text-4xl sm:text-5xl text-yellow-400 filter drop-shadow-sm mb-2 animate-bounce duration-[3000ms]">⭐</div>
              <div className="text-3xl sm:text-4xl font-black tracking-tighter text-yellow-300">50 NĂM</div>
              <div className="text-[10px] sm:text-xs font-black tracking-widest text-white/90 uppercase mt-1">Thành phố Hồ Chí Minh</div>
              <div className="text-[11px] font-bold text-yellow-400/80 mt-2 border-t border-white/10 pt-2 w-full">02/07/1976 - 02/07/2026</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative z-10">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-red-600 rounded-full" />
            Danh mục xe đạp chính hãng
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
                className="group bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:border-red-500/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl group-hover:bg-red-50 group-hover:scale-110 transition-all duration-300">
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

      {/* 3. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <div className="flex items-end justify-between mb-8 border-b border-slate-100 pb-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
            Sản phẩm nổi bật
          </h2>
          <Link 
            to="/products" 
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 hover:translate-x-0.5 transition-all duration-200 flex items-center gap-1"
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

      {/* 4. Newest Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 mb-16 relative z-10">
        <div className="flex items-end justify-between mb-8 border-b border-slate-100 pb-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-amber-500 rounded-full" />
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

      {/* TẬP HỢP HIỆU ỨNG ĐỘNG PHÁO HOA KỶ NIỆM CHÀO MỪNG ĐẠI LỄ */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        /* Tạo hạt sáng giả lập pháo hoa nở rộ lấp lánh */
        @keyframes firework {
          0% { transform: translateY(100vh) scale(0.5); opacity: 1; }
          50% { opacity: 1; }
          100% { transform: translateY(-20vh) scale(2.5); opacity: 0; filter: blur(2px); }
        }
        .firework-particle {
          position: absolute;
          bottom: -100px;
          border-radius: 50%;
          background: radial-gradient(circle, #facc15 0%, transparent 80%);
          animation: firework linear infinite;
        }
        .fp-1 { left: 15%; width: 120px; h-120px; animation-duration: 6s; animation-delay: 0s; }
        .fp-2 { left: 55%; width: 160px; h-160px; animation-duration: 8s; animation-delay: 2s; }
        .fp-3 { left: 80%; width: 90px; h-90px; animation-duration: 5s; animation-delay: 4s; }
      `}</style>
    </div>
  );
}