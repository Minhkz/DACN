"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bot, Send, X, Loader2 } from "lucide-react";
import { askChatbot } from "@/services/chatbot/ChatbotApi";
import {
  ChatMessage,
  ChatProductDto,
  ChatRequest,
  ChatResponse,
} from "@/types/chatbot/ChatbotType";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const createMessageId = () => {
  return `${Date.now()}-${Math.random()}`;
};

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createMessageId(),
      role: "BOT",
      content:
        "Xin chào! Mình là chatbot tư vấn laptop. Bạn muốn tìm laptop học tập, gaming hay văn phòng?",
      createdAt: new Date().toISOString(),
    },
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Tự động cuộn xuống dưới khi có tin nhắn mới
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const askMutation = useMutation<ChatResponse, Error, ChatRequest>({
    mutationFn: askChatbot,
    onSuccess: (data) => {
      const botMessage: ChatMessage = {
        id: createMessageId(),
        role: "BOT",
        content: data.answer,
        products: data.products || [],
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    },
    onError: () => {
      const errorMessage: ChatMessage = {
        id: createMessageId(),
        role: "BOT",
        content:
          "Hiện tại chatbot đang phản hồi chậm hoặc gặp lỗi. Bạn vui lòng thử lại sau.",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    },
  });

  const handleSubmit = () => {
    const trimmed = message.trim();

    if (!trimmed || askMutation.isPending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "USER",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    askMutation.mutate({
      message: trimmed,
    });
  };

  const handleSuggestionClick = (text: string) => {
    setMessage(text);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <>
      {/* Animation CSS nhúng nội bộ */}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.6); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(24px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes floatBob {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.5);
          }
          70% {
            box-shadow: 0 0 0 14px rgba(37, 99, 235, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
          }
        }
        .animate-scale-in {
          animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-pop-in {
          animation: popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: bottom right;
        }
        .animate-chat-btn {
          animation: floatBob 3s ease-in-out infinite, pulseGlow 2.5s infinite;
        }
      `}</style>

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white transition-all duration-300 hover:scale-110 active:scale-95 animate-chat-btn cursor-pointer"
          style={{ padding: "16px" }}
        >
          <Bot size={28} />
        </button>
      )}

      {/* Khung chat */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 flex w-[380px] max-w-[calc(100vw-32px)] flex-col rounded-3xl border border-slate-100 bg-white shadow-2xl animate-pop-in"
          style={{ height: "640px" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between rounded-t-[22px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
            style={{ padding: "18px 20px" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                <Bot size={24} />
              </div>

              <div>
                <h3 className="font-bold text-sm tracking-tight">
                  AI Laptop Assistant
                </h3>
                <p
                  className="text-xs text-blue-100/90"
                  style={{ marginTop: "2px" }}
                >
                  Tư vấn sản phẩm tự động
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-full hover:bg-white/20 transition-colors cursor-pointer"
              style={{ padding: "8px" }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Khung chứa hội thoại */}
          <div
            className="flex-1 overflow-y-auto bg-slate-50/70"
            style={{ padding: "20px" }}
          >
            <div className="flex flex-col gap-4">
              {messages.map((item) => (
                <ChatBubble key={item.id} message={item} />
              ))}

              {askMutation.isPending && (
                <div className="flex justify-start">
                  <div
                    className="flex items-center gap-2 rounded-2xl bg-white text-xs text-slate-500 shadow-sm border border-slate-100/80"
                    style={{ padding: "12px 16px" }}
                  >
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                    Laptop Assistant đang suy nghĩ...
                  </div>
                </div>
              )}
              {/* Dummy div phục vụ tự động cuộn */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Footer chứa Input & Gợi ý */}
          <div
            className="border-t border-slate-100 bg-white"
            style={{ padding: "16px" }}
          >
            <div
              className="flex flex-wrap gap-1.5"
              style={{ marginBottom: "12px" }}
            >
              <SuggestionButton
                text="Còn hàng không?"
                onClick={handleSuggestionClick}
              />
              <SuggestionButton
                text="Laptop gaming dưới 20M"
                onClick={handleSuggestionClick}
              />
              <SuggestionButton
                text="Laptop học tập"
                onClick={handleSuggestionClick}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                style={{ padding: "12px 16px" }}
              />

              <button
                onClick={handleSubmit}
                disabled={askMutation.isPending || !message.trim()}
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all hover:shadow-[0_4px_12px_rgba(37,99,235,0.3)] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:shadow-none cursor-pointer"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;

type ChatBubbleProps = {
  message: ChatMessage;
};

const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isUser = message.role === "USER";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl text-[13.5px] leading-relaxed shadow-sm ${
            isUser
              ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none"
              : "border border-slate-100/80 bg-white text-slate-800 rounded-tl-none"
          }`}
          style={{ padding: "12px 16px" }}
        >
          {message.content}
        </div>

        {!isUser && message.products && message.products.length > 0 && (
          <div className="flex flex-col gap-2.5" style={{ marginTop: "12px" }}>
            {message.products.map((product) => (
              <ChatProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

type ChatProductCardProps = {
  product: ChatProductDto;
};

const ChatProductCard = ({ product }: ChatProductCardProps) => {
  return (
    <div
      className="rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-200 hover:border-blue-100 hover:shadow-md"
      style={{ padding: "12px" }}
    >
      <div className="flex gap-3">
        <img
          src={product.avatar || "/placeholder-product.png"}
          alt={product.name}
          className="h-14 w-14 rounded-xl border border-slate-100 object-contain bg-slate-50/30 shrink-0"
        />

        <div className="min-w-0 flex-1 flex flex-col justify-between">
          <h4 className="line-clamp-2 text-xs font-bold text-slate-800 leading-snug">
            {product.name}
          </h4>

          <p
            className="text-[13px] font-extrabold text-[#0156ff]"
            style={{ marginTop: "4px" }}
          >
            {formatCurrency(product.price)}
          </p>

          <a
            className="inline-block text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
            style={{ marginTop: "6px" }}
            href={`/products/${product.id}`}
          >
            Xem chi tiết →
          </a>
        </div>
      </div>
    </div>
  );
};

type SuggestionButtonProps = {
  text: string;
  onClick: (text: string) => void;
};

const SuggestionButton = ({ text, onClick }: SuggestionButtonProps) => {
  return (
    <button
      onClick={() => onClick(text)}
      className="rounded-full border border-blue-100 bg-blue-50/50 text-[11px] font-semibold text-blue-700 hover:bg-blue-100/70 hover:border-blue-200 transition-all cursor-pointer"
      style={{ padding: "6px 12px" }}
    >
      {text}
    </button>
  );
};
