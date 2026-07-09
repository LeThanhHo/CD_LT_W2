// src/pages/HomePage.jsx
// Senior UI/UX Redesign - Luxury Cycling E-Commerce Platform (Canyon & Apple Vibe)
// Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Bike, 
  ShieldCheck, 
  Wrench, 
  Truck, 
  Zap, 
  Star, 
  Mail, 
  ChevronRight, 
  Sparkles, 
  TrendingUp, 
  Flame, 
  MessageSquare, 
  Newspaper,
  Award,
  CreditCard,
  HeartHandshake
} from "lucide-react";

import productService from "../services/productService";
import categoryService from "../services/categoryService";
import postService from "../services/postService";
import reviewService from "../services/reviewService";
import bannerService from "../services/bannerService";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { resolveImageUrl } from "../components/ProductCard";

// Biến cấu hình Animation Scroll Reveal chung cho toàn bộ trang chủ
const scrollRevealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "keyframe" } }
};

// 🎯 1. HERO SECTION - FULL SCREEN (100vh) WITH FLOATING & ZOOM EFFECS
function LuxuryHero({ banners, loadingBanners }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), 6000);
    return () => clearInterval(timer);
  }, [banners]);

  if (loadingBanners || banners.length === 0) {
    return (
      <div className="h-screen bg-[#0F172A] flex items-center justify-center text-white/30">
        <Loader small />
      </div>
    );
  }

  const currentSlide = banners[index];

  return (
    <section className="relative w-full h-screen bg-[#0B0F19] flex items-center overflow-hidden select-none">
      {/* Background Image Zoom Animation */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <motion.img
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 0.45, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={resolveImageUrl(currentSlide.image)}
          alt={currentSlide.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4.rem] z-10 pointer-events-none" />

      {/* Floating Content Core */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 w-full relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-blue-500 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> High-Performance Machinery
          </div>
          
          <h1 className="font-sans font-black text-5xl md:text-8xl text-white tracking-tighter leading-[0.9] uppercase">
            {currentSlide.title}
          </h1>
          
          <p className="text-gray-400 text-sm md:text-base max-w-md font-medium leading-relaxed">
            Khám phá những siêu phẩm xe đạp carbon nguyên khối được tối ưu khí động học, đồng hành cùng bạn trên mọi cung đường đua đỉnh cao.
          </p>
          
          {currentSlide.link && (
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to={currentSlide.link}
                className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300 shadow-xl shadow-blue-600/10 group active:scale-95"
              >
                Mua ngay
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-xs active:scale-95"
              >
                Khám phá
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Slide Navigation Bullets */}
      {banners.length > 1 && (
        <div className="absolute bottom-12 right-6 md:right-8 z-30 flex items-center gap-2.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${i === index ? "bg-blue-600 w-12" : "bg-white/20 w-4 hover:bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// 🎯 2. FLASH SALE SECTION WITH COUNTDOWN
function FlashSaleSection({ products }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={scrollRevealVariants}
      className="max-w-7xl mx-auto px-6 md:px-8 py-12 relative z-10"
    >
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-500/10 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.06),transparent_60%)] pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-lg px-2.5 py-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">
            <Zap className="w-3 h-3 fill-red-500 text-red-500" /> Limited Campaign
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">FLASH SALE CHỚP NHOÁNG</h2>
          <p className="text-slate-400 text-xs font-medium">Sở hữu những dòng siêu xe cao cấp hàng đầu với ưu đãi trợ giá đặc quyền từ nhà phân phối.</p>
        </div>

        {/* Countdown Core UI */}
        <div className="flex items-center gap-3 relative z-10 font-mono text-white">
          <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3 min-w-[70px]">
            <span className="text-xl md:text-2xl font-black text-blue-500">{String(timeLeft.hours).padStart(2, "0")}</span>
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider opacity-40 mt-0.5">Giờ</span>
          </div>
          <span className="text-xl font-bold text-blue-500/40 animate-pulse">:</span>
          <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3 min-w-[70px]">
            <span className="text-xl md:text-2xl font-black text-blue-500">{String(timeLeft.minutes).padStart(2, "0")}</span>
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider opacity-40 mt-0.5">Phút</span>
          </div>
          <span className="text-xl font-bold text-blue-500/40 animate-pulse">:</span>
          <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3 min-w-[70px]">
            <span className="text-xl md:text-2xl font-black text-blue-500">{String(timeLeft.seconds).padStart(2, "0")}</span>
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider opacity-40 mt-0.5">Giây</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default function HomePage() {
  const [banners, setBanners] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newest, setNewest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBanners, setLoadingBanners] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // GIỮ NGUYÊN HOÀN TOÀN LUỒNG PHỐI HỢP PHƯƠNG THỨC API GỐC CỦA HỒ
        const [f, b, n, c, p, t, bn] = await Promise.all([
          productService.getFeatured(),
          productService.getBestSellers(),
          productService.getNewest(),
          categoryService.getAll(),
          postService.getPublished(),
          reviewService.getTestimonials(),
          bannerService.getActive(),
        ]);
        setFeatured(f.data || []);
        setBestSellers(b.data || []);
        setNewest(n.data || []);
        setCategories(c.data || []);
        setPosts(p.data?.slice(0, 3) || []);
        setTestimonials(t.data || []);
        setBanners(bn.data || []);
      } catch (err) {
        console.error("Lỗi fetch dữ liệu đồng bộ trang chủ:", err);
      } finally {
        setLoading(false);
        setLoadingBanners(false);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans antialiased text-[#0F172A] overflow-hidden">
      
      {/* 🎯 SECTION 1: HERO CONTAINER (100vh) */}
      <LuxuryHero banners={banners} loadingBanners={loadingBanners} />

      {/* 🎯 SECTION 2: FLASH SALE BLOCK */}
      {!loading && <FlashSaleSection products={featured.slice(0, 1)} />}

      {/* 🎯 SECTION 3: CATEGORIES DYNAMIC GRID */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollRevealVariants}
        className="max-w-7xl mx-auto px-6 md:px-8 py-16 relative z-10"
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1 h-6 bg-[#0F172A] rounded-full" />
          <h2 className="font-sans font-black text-2xl tracking-tight uppercase">Phân khúc dòng xe chuyên dụng</h2>
        </div>
        
        {loading ? <Loader small /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?categoryId=${cat.id}`}
                className="group relative bg-white border border-slate-200/60 rounded-2xl p-6 text-center hover:border-blue-600 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between min-h-[140px]"
              >
                <div className="absolute -right-4 -bottom-4 opacity-[0.02] text-[#0F172A] group-hover:scale-110 group-hover:text-blue-600 transition-all duration-500">
                  <Bike className="w-24 h-24" />
                </div>
                <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{cat.name}</p>
                <span className="inline-flex items-center gap-1 justify-center mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors w-max mx-auto">
                  Explore Series <ChevronRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </motion.section>

      {/* 🎯 SECTION 4: MID PROMOTIONAL ADVERTISEMENT BANNER (FULL WIDTH CARD STYLE) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollRevealVariants}
        className="max-w-7xl mx-auto px-6 md:px-8 py-4"
      >
        <div className="w-full h-[320px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative group shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14 max-w-xl space-y-4 z-10 text-white">
            <span className="text-[10px] font-bold tracking-widest text-blue-500 uppercase">Advanced Carbon Grid</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none uppercase">Khí động học tối ưu.<br/>Bứt tốc vượt giới hạn.</h2>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">Cấu trúc sợi carbon tổng hợp nguyên tấm giúp tối giản trọng lượng vật lý, hấp thụ xung lực rung chấn mặt đường tuyệt đối.</p>
            <Link to="/products" className="text-xs font-bold text-blue-500 flex items-center gap-1.5 hover:text-white transition-colors pt-2 uppercase tracking-wider">
              Sở hữu bộ khung Pro Race <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-5 group-hover:scale-105 transition-transform duration-700 hidden md:block">
            <Bike className="w-full h-full p-12 text-white" />
          </div>
        </div>
      </motion.section>

      {/* 🎯 SECTION 5: FEATURED PRODUCTS GRID ZONE */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollRevealVariants}
        className="max-w-7xl mx-auto px-6 md:px-8 py-16"
      >
        <div className="flex items-end justify-between border-b border-slate-200/60 pb-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#0F172A] rounded-full" />
            <h2 className="font-sans font-black text-2xl tracking-tight uppercase flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" /> Sản phẩm nổi bật
            </h2>
          </div>
          <Link to="/products" className="group text-xs font-bold text-blue-600 hover:text-[#0F172A] flex items-center gap-1 transition-colors uppercase tracking-wider">
            Xem tất cả <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        {loading ? <Loader /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((p) => (
              <div key={p.id} className="hover:-translate-y-1.5 transition-transform duration-300">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* 🎯 SECTION 6: BEST SELLERS INTERACTIVE GRID (DISTINCT DESIGN WITH EMPHASIZED CORNER TAGS) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollRevealVariants}
        className="max-w-7xl mx-auto px-6 md:px-8 py-12"
      >
        <div className="flex items-end justify-between border-b border-slate-200/60 pb-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#0F172A] rounded-full" />
            <h2 className="font-sans font-black text-2xl tracking-tight uppercase flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> Dòng xe bán chạy nhất
            </h2>
          </div>
          <Link to="/products" className="group text-xs font-bold text-blue-600 hover:text-[#0F172A] flex items-center gap-1 transition-colors uppercase tracking-wider">
            Xem tất cả <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        {loading ? <Loader /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((p) => (
              <div key={p.id} className="relative group/bestseller hover:-translate-y-1.5 transition-transform duration-300 bg-white border border-slate-200/40 rounded-2xl p-1 shadow-2xs">
                {/* 🎯 BEST SELLER DISTINCTIVE BADGE */}
                <div className="absolute top-4 left-4 z-20 bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md flex items-center gap-1 border border-slate-800">
                  <Award className="w-3 h-3 text-blue-500 fill-blue-500" /> Best Seller
                </div>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* 🎯 SECTION 7: NEW PRODUCTS ZONE */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollRevealVariants}
        className="max-w-7xl mx-auto px-6 md:px-8 py-12"
      >
        <div className="flex items-center gap-3 border-b border-slate-200/60 pb-4 mb-8">
          <div className="w-1 h-6 bg-[#0F172A] rounded-full" />
          <h2 className="font-sans font-black text-2xl tracking-tight uppercase flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500 fill-red-500" /> Bộ sưu tập mẫu xe mới về
          </h2>
        </div>
        {loading ? <Loader /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newest.map((p) => (
              <div key={p.id} className="hover:-translate-y-1.5 transition-transform duration-300">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* 🎯 SECTION 8: WHY CHOOSE US - 5 CORE BENEFITS MATRIX (Apple / Specialized Vibe) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollRevealVariants}
        className="bg-slate-900 text-white py-20 my-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.03),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 space-y-14">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Premium Logistics & Care Matrix</span>
            <h2 className="text-3xl font-black tracking-tight uppercase">ĐẶC QUYỀN ĐỒNG HÀNH CỦA RIDER</h2>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">Chúng tôi quy chuẩn hóa dịch vụ bảo trì, bàn giao xe trọn gói nhằm đem đến trải nghiệm vận hành trơn tru nhất.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-blue-500/30 hover:bg-white/[0.07] transition duration-300 flex flex-col justify-between">
              <div className="w-9 h-9 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center"><Truck className="w-4.5 h-4.5" /></div>
              <div className="space-y-1">
                <h3 className="font-bold text-xs uppercase tracking-tight text-white">Giao hàng siêu tốc</h3>
                <p className="text-slate-400 text-[11px] leading-relaxed font-medium">Đóng gói bọc xốp giảm chấn chuyên dụng, giao xe nguyên kiện hỏa tốc tận nhà.</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-blue-500/30 hover:bg-white/[0.07] transition duration-300 flex flex-col justify-between">
              <div className="w-9 h-9 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center"><ShieldCheck className="w-4.5 h-4.5" /></div>
              <div className="space-y-1">
                <h3 className="font-bold text-xs uppercase tracking-tight text-white">Chính hãng 100%</h3>
                <p className="text-slate-400 text-[11px] leading-relaxed font-medium">Nhập khẩu chính ngạch nguyên chiếc từ Canyon, Trek, Giant quốc tế.</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-blue-500/30 hover:bg-white/[0.07] transition duration-300 flex flex-col justify-between">
              <div className="w-9 h-9 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center"><Wrench className="w-4.5 h-4.5" /></div>
              <div className="space-y-1">
                <h3 className="font-bold text-xs uppercase tracking-tight text-white">Bảo hành trọn đời</h3>
                <p className="text-slate-400 text-[11px] leading-relaxed font-medium">Ủy quyền kiểm duyệt, bảo dưỡng định kỳ hệ thống khung sườn Carbon trọn đời.</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-blue-500/30 hover:bg-white/[0.07] transition duration-300 flex flex-col justify-between">
              <div className="w-9 h-9 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center"><CreditCard className="w-4.5 h-4.5" /></div>
              <div className="space-y-1">
                <h3 className="font-bold text-xs uppercase tracking-tight text-white">Thanh toán an toàn</h3>
                <p className="text-slate-400 text-[11px] leading-relaxed font-medium">Tích hợp cổng VNPay, MoMo mã hóa bảo mật, hỗ trợ tài chính trả góp 0%.</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-blue-500/30 hover:bg-white/[0.07] transition duration-300 flex flex-col justify-between">
              <div className="w-9 h-9 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center"><HeartHandshake className="w-4.5 h-4.5" /></div>
              <div className="space-y-1">
                <h3 className="font-bold text-xs uppercase tracking-tight text-white">Hỗ trợ kỹ thuật 24/7</h3>
                <p className="text-slate-400 text-[11px] leading-relaxed font-medium">Đội ngũ kỹ thuật viên cơ khí chuyên sâu tư vấn giải đáp thắc mắc của bạn.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 🎯 SECTION 9: CUSTOMER REVIEWS INTERACTIVE Matrix */}
      {!loading && testimonials.length > 0 && (
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scrollRevealVariants}
          className="max-w-7xl mx-auto px-6 md:px-8 py-12 relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-10">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="font-sans font-black text-2xl tracking-tight uppercase">Đánh giá từ cộng đồng Rider</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((r) => (
              <div key={r.id} className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-slate-300 transition duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex text-amber-400 gap-0.5 text-[11px] mb-4">
                    {"★".repeat(r.rating)}
                    <span className="text-slate-200">{"★".repeat(5 - r.rating)}</span>
                  </div>
                  <p className="text-xs text-slate-500 italic leading-relaxed mb-6 font-medium">"{r.comment}"</p>
                </div>
                <div className="border-t border-slate-100 pt-4 mt-auto">
                  <p className="text-xs font-extrabold text-[#0F172A]">{r.userFullname}</p>
                  <p className="text-[10px] text-blue-600 font-bold mt-0.5 truncate">{r.productName}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 🎯 SECTION 10: BLOG JOURNAL MÀN HÌNH LỚN */}
      {!loading && posts.length > 0 && (
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scrollRevealVariants}
          className="max-w-7xl mx-auto px-6 md:px-8 py-16"
        >
          <div className="flex items-end justify-between border-b border-slate-200/60 pb-4 mb-10">
            <div className="flex items-center gap-3">
              <Newspaper className="w-5 h-5 text-[#0F172A]" />
              <h2 className="font-sans font-black text-2xl tracking-tight uppercase">Cẩm nang đường trường & Tin tức</h2>
            </div>
            <Link to="/posts" className="group text-xs font-bold text-blue-600 hover:text-[#0F172A] flex items-center gap-1 transition-colors uppercase tracking-wider">
              Xem tất cả <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/posts/${post.slug}`}
                className="group block bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-300"
              >
                <div className="aspect-[16/10] bg-slate-50 overflow-hidden relative border-b border-slate-100">
                  <img
                    src={resolveImageUrl(post.thumbnail) || "https://placehold.co/400x225?text=BikeShop"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {new Date(post.createdAt).toLocaleDateString("vi-VN", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <h3 className="font-bold text-[#0F172A] text-sm group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      {/* 🎯 SECTION 11: NEWSLETTER INPUT ZONE (LAST SECTION BEFORE SYSTEM FOOTER) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={scrollRevealVariants}
        className="max-w-7xl mx-auto px-6 md:px-8 py-8 relative z-10 mb-12"
      >
        <div className="bg-[#0B0F19] border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden text-center flex flex-col items-center space-y-4 shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_70%)] pointer-events-none" />
          <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-blue-500"><Mail className="w-5 h-5" /></div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">Gia nhập cộng đồng Rider</h2>
          <p className="text-slate-400 text-xs font-medium max-w-sm leading-relaxed">Đăng ký nhận thông tin các đợt phát hành linh kiện Pro giới hạn, cẩm nang cơ khí xe đạp và mã ưu đãi đặc quyền hàng tuần.</p>
          <div className="w-full max-w-md flex gap-2 bg-white/5 p-1.5 border border-white/10 rounded-xl focus-within:border-blue-500/50 transition duration-300">
            <input 
              type="email" 
              placeholder="Nhập địa chỉ email chính thức của bạn..." 
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none px-3"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors shadow-md shadow-blue-600/10">Đăng ký</button>
          </div>
        </div>
      </motion.section>

    </div>
  );
}