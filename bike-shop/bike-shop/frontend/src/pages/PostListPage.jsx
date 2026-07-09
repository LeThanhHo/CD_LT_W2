import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import postService from "../services/postService";
import { resolveImageUrl } from "../components/ProductCard";
import Loader from "../components/Loader";

export default function PostListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postService
      .getPublished()
      .then((res) => setPosts(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl text-ink mb-2">Bài viết & Tin tức</h1>
      <p className="text-steel mb-8">Kinh nghiệm chọn xe, bảo dưỡng và tin tức từ BikeShop.</p>

      {posts.length === 0 ? (
        <p className="text-steel text-center py-16">Chưa có bài viết nào.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {post.author && ` · ${post.author}`}
                </p>
                <h3 className="font-semibold text-ink line-clamp-2 group-hover:text-ember transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-steel line-clamp-3">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
