import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import favoriteService from "../services/favoriteService";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    favoriteService
      .getAll()
      .then((res) => setFavorites(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl text-ink mb-6">Sản phẩm yêu thích</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-steel mb-4">Bạn chưa lưu sản phẩm yêu thích nào.</p>
          <Link to="/products" className="text-ember font-semibold hover:underline">
            Khám phá sản phẩm →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {favorites.map((fav) => (
            <ProductCard key={fav.id} product={fav.product} />
          ))}
        </div>
      )}
    </div>
  );
}
