import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import postService from "../services/postService";
import reviewService from "../services/reviewService";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { resolveImageUrl } from "../components/ProductCard";

const SLIDES = [
  {
    tag: "XE ĐẠP CHÍNH HÃNG",
    title: "ĐẠP NHANH HƠN.",
    highlight: "ĐI XA HƠN.",
    desc: "Từ đường đua tốc độ đến cung đường off-road, BikeShop mang đến những chiếc xe đạp được chọn lọc kỹ càng từ các thương hiệu hàng đầu thế giới.",
    cta: "Khám phá ngay",
    link: "/products",
  },
  {
    tag: "ƯU ĐÃI MỖI TUẦN",
    title: "MIỄN PHÍ GIAO HÀNG",
    highlight: "TOÀN QUỐC.",
    desc: "Đặt hàng hôm nay, nhận xe trong 2-5 ngày. Thanh toán linh hoạt: COD, chuyển khoản, thẻ, MoMo, VNPay.",
    cta: "Xem sản phẩm",
    link: "/products",
  },
  {
    tag: "TRẢI NGHIỆM MUA SẮM",
    title: "TRỢ LÝ AI",
    highlight: "TƯ VẤN 24/7.",
    desc: "Chưa biết chọn xe nào? Bấm vào khung chat góc màn hình để được tư vấn ngay dựa trên nhu cầu của bạn.",
    cta: "Xem bài viết",
    link: "/posts",
  },
];

function BannerSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative bg-ink text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent, transparent 60px, rgba(201,255,61,0.15) 60px, rgba(201,255,61,0.15) 62px)",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative">
        <p className="text-volt font-semibold tracking-widest text-sm mb-4">{slide.tag}</p>
        <h1 className="font-display text-4xl md:text-6xl leading-tight max-w-2xl">
          {slide.title}
          <br />
          <span className="text-volt">{slide.highlight}</span>
        </h1>
        <p className="text-white/70 mt-6 max-w-lg">{slide.desc}</p>
        <Link
          to={slide.link}
          className="inline-block mt-8 bg-volt text-ink font-bold px-8 py-3 rounded-md hover:brightness-95 transition"
        >
          {slide.cta}
        </Link>

        <div className="flex gap-2 mt-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "bg-volt w-8" : "bg-white/30 w-4"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newest, setNewest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [f, b, n, c, p, t] = await Promise.all([
          productService.getFeatured(),
          productService.getBestSellers(),
          productService.getNewest(),
          categoryService.getAll(),
          postService.getPublished(),
          reviewService.getTestimonials(),
        ]);
        setFeatured(f.data);
        setBestSellers(b.data);
        setNewest(n.data);
        setCategories(c.data);
        setPosts(p.data.slice(0, 3));
        setTestimonials(t.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <BannerSlider />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-display text-2xl text-ink mb-6">Danh mục xe</h2>
        {loading ? (
          <Loader small />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?categoryId=${cat.id}`}
                className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:border-ember hover:shadow-md transition"
              >
                <p className="font-semibold text-ink text-sm">{cat.name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-ink">Sản phẩm nổi bật</h2>
          <Link to="/products" className="text-ember text-sm font-semibold hover:underline">
            Xem tất cả →
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Best sellers */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-ink">Xe bán chạy</h2>
          <Link to="/products" className="text-ember text-sm font-semibold hover:underline">
            Xem tất cả →
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Newest products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-ink">Xe mới về</h2>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {newest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Customer feedback */}
      {!loading && testimonials.length > 0 && (
        <section className="bg-white border-y border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-display text-2xl text-ink mb-6">Khách hàng nói gì về BikeShop</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.slice(0, 3).map((r) => (
                <div key={r.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <div className="text-amber-500 text-sm mb-2">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </div>
                  <p className="text-sm text-ink mb-3 line-clamp-4">"{r.comment}"</p>
                  <p className="text-xs font-semibold text-steel">
                    {r.userFullname} · <span className="text-ember">{r.productName}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest posts */}
      {!loading && posts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-ink">Bài viết mới nhất</h2>
            <Link to="/posts" className="text-ember text-sm font-semibold hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/posts/${post.slug}`}
                className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={resolveImageUrl(post.thumbnail) || "https://placehold.co/400x225?text=BikeShop"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-steel mb-1">
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                  <h3 className="font-semibold text-ink line-clamp-2 group-hover:text-ember transition-colors">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
