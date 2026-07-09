import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, X, Send } from "lucide-react";
import chatService from "../../services/chatService";
import { formatVND, resolveImageUrl } from "../ProductCard";

const WELCOME_MESSAGE = {
  role: "bot",
  text: "Xin chào! Mình là trợ lý ảo của BikeShop 🚲. Bạn cần tư vấn xe đạp, giá cả, hay chính sách giao hàng, cứ hỏi mình nhé!",
  products: [],
};

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setSending(true);

    try {
      const res = await chatService.sendMessage(text);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: res.data.reply, products: res.data.suggestedProducts || [] },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Xin lỗi, mình đang gặp sự cố kết nối. Bạn vui lòng thử lại sau hoặc để lại lời nhắn ở trang Liên hệ nhé.",
          products: [],
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-ember text-white shadow-lg flex items-center justify-center hover:brightness-95 transition"
        aria-label="Mở chat hỗ trợ"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[92vw] h-[480px] max-h-[70vh] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-ink text-white px-4 py-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full" />
            <p className="font-semibold text-sm">Trợ lý BikeShop</p>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                    m.role === "user" ? "bg-ember text-white" : "bg-white border border-gray-200 text-ink"
                  }`}
                >
                  {m.text}

                  {m.products && m.products.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {m.products.map((p) => (
                        <Link
                          key={p.id}
                          to={`/products/${p.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-md p-2 transition"
                        >
                          <img
                            src={resolveImageUrl(p.image) || "https://placehold.co/40x40?text=Bike"}
                            alt=""
                            className="w-10 h-10 object-cover rounded-md shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-ink line-clamp-1">{p.name}</p>
                            <p className="text-xs text-ember font-semibold">{formatVND(p.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-steel">
                  Đang trả lời...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-200 p-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="w-9 h-9 rounded-md bg-ember text-white flex items-center justify-center disabled:opacity-50"
              aria-label="Gửi"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
