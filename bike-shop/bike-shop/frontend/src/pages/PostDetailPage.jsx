import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import postService from "../services/postService";
import { resolveImageUrl } from "../components/ProductCard";
import Loader from "../components/Loader";

export default function PostDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    postService
      .getBySlug(slug)
      .then((res) => setPost(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <Loader />;

  if (notFound || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-steel mb-4">Không tìm thấy bài viết này.</p>
        <Link to="/posts" className="text-ember font-semibold hover:underline">
          ← Quay lại danh sách bài viết
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-steel mb-6">
        <Link to="/posts" className="hover:text-ember">Bài viết</Link> /{" "}
        <span className="text-ink">{post.title}</span>
      </nav>

      <h1 className="font-display text-3xl text-ink mb-3">{post.title}</h1>
      <p className="text-sm text-steel mb-6">
        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
        {post.author && ` · Tác giả: ${post.author}`}
      </p>

      {post.thumbnail && (
        <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-8">
          <img
            src={resolveImageUrl(post.thumbnail)}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="prose max-w-none text-ink leading-relaxed whitespace-pre-line">
        {post.content}
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200">
        <Link to="/posts" className="text-ember font-semibold hover:underline">
          ← Xem thêm bài viết khác
        </Link>
      </div>
    </article>
  );
}
