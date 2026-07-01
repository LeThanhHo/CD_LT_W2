import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import brandService from "../services/brandService";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function ProductPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const keyword = searchParams.get("keyword") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const brandId = searchParams.get("brandId") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const page = parseInt(searchParams.get("page") || "0", 10);

  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data));
    brandService.getAll().then((res) => setBrands(res.data));
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getAll({
        keyword: keyword || undefined,
        categoryId: categoryId || undefined,
        brandId: brandId || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sortBy: sortBy || undefined,
        page,
        size: 12,
      });
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
    } finally {
      setLoading(false);
    }
  }, [keyword, categoryId, brandId, minPrice, maxPrice, sortBy, page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "0");
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl text-ink mb-6">
        {keyword ? `Kết quả cho "${keyword}"` : "Tất cả sản phẩm"}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Filters */}
        <aside className="bg-white border border-gray-200 rounded-xl p-5 h-fit space-y-6">
          <div>
            <h3 className="font-semibold text-ink text-sm mb-3">Danh mục</h3>
            <div className="space-y-2 text-sm">
              <button
                onClick={() => updateParam("categoryId", "")}
                className={`block w-full text-left ${!categoryId ? "text-ember font-semibold" : "text-steel"}`}
              >
                Tất cả
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateParam("categoryId", c.id)}
                  className={`block w-full text-left ${
                    categoryId === String(c.id) ? "text-ember font-semibold" : "text-steel"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-ink text-sm mb-3">Hãng xe</h3>
            <div className="space-y-2 text-sm">
              <button
                onClick={() => updateParam("brandId", "")}
                className={`block w-full text-left ${!brandId ? "text-ember font-semibold" : "text-steel"}`}
              >
                Tất cả
              </button>
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => updateParam("brandId", b.id)}
                  className={`block w-full text-left ${
                    brandId === String(b.id) ? "text-ember font-semibold" : "text-steel"
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-ink text-sm mb-3">Khoảng giá</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Từ"
                defaultValue={minPrice}
                onBlur={(e) => updateParam("minPrice", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
              />
              <input
                type="number"
                placeholder="Đến"
                defaultValue={maxPrice}
                onBlur={(e) => updateParam("maxPrice", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
              />
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div>
          <div className="flex justify-end mb-4">
            <select
              value={sortBy}
              onChange={(e) => updateParam("sortBy", e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Sắp xếp: Mặc định</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="newest">Mới nhất</option>
              <option value="name_asc">Tên A-Z</option>
            </select>
          </div>

          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <p className="text-steel text-center py-16">Không tìm thấy sản phẩm phù hợp.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => updateParam("page", i)}
                      className={`w-9 h-9 rounded-md text-sm font-medium ${
                        page === i ? "bg-ember text-white" : "bg-white border border-gray-300 text-steel"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
