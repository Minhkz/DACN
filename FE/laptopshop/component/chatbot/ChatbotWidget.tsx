"use client";

import React, { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bot, Send, X, MessageCircle, Loader2 } from "lucide-react";
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
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl transition hover:bg-blue-700"
          style={{ padding: "16px" }}
        >
          <MessageCircle size={28} />
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 flex w-[380px] max-w-[calc(100vw-32px)] flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl"
          style={{ height: "640px" }}
        >
          <div
            className="flex items-center justify-between rounded-t-3xl bg-blue-600 text-white"
            style={{ padding: "16px" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
                <Bot size={24} />
              </div>

              <div>
                <h3 className="font-bold">AI Laptop Assistant</h3>
                <p
                  className="text-xs text-blue-100"
                  style={{ marginTop: "2px" }}
                >
                  Tư vấn sản phẩm tự động
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-full hover:bg-white/20"
              style={{ padding: "8px" }}
            >
              <X size={20} />
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto bg-slate-50"
            style={{ padding: "16px" }}
          >
            <div className="flex flex-col gap-4">
              {messages.map((item) => (
                <ChatBubble key={item.id} message={item} />
              ))}

              {askMutation.isPending && (
                <div className="flex justify-start">
                  <div
                    className="flex items-center gap-2 rounded-2xl bg-white text-sm text-slate-500 shadow-sm"
                    style={{ padding: "12px 14px" }}
                  >
                    <Loader2 size={16} className="animate-spin" />
                    Chatbot đang suy nghĩ...
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className="border-t border-slate-200 bg-white"
            style={{ padding: "12px" }}
          >
            <div
              className="flex flex-wrap gap-2"
              style={{ marginBottom: "10px" }}
            >
              <SuggestionButton
                text="Có bao nhiêu sản phẩm trong kho?"
                onClick={handleSuggestionClick}
              />
              <SuggestionButton
                text="Có laptop gaming dưới 20 triệu không?"
                onClick={handleSuggestionClick}
              />
              <SuggestionButton
                text="Tư vấn laptop học tập"
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
                className="flex-1 rounded-2xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500"
                style={{ padding: "12px 14px" }}
              />

              <button
                onClick={handleSubmit}
                disabled={askMutation.isPending || !message.trim()}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Send size={18} />
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
          className={`rounded-2xl text-sm leading-6 shadow-sm ${
            isUser
              ? "bg-blue-600 text-white"
              : "border border-slate-200 bg-white text-slate-800"
          }`}
          style={{ padding: "12px 14px" }}
        >
          {message.content}
        </div>

        {!isUser && message.products && message.products.length > 0 && (
          <div className="flex flex-col gap-3" style={{ marginTop: "10px" }}>
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
      className="rounded-2xl border border-slate-200 bg-white shadow-sm"
      style={{ padding: "10px" }}
    >
      <div className="flex gap-3">
        <img
          src={product.avatar || "/placeholder-product.png"}
          alt={product.name}
          className="h-16 w-16 rounded-xl border border-slate-200 object-cover"
        />

        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-2 text-sm font-semibold text-slate-900">
            {product.name}
          </h4>

          <p
            className="text-sm font-bold text-red-600"
            style={{ marginTop: "6px" }}
          >
            {formatCurrency(product.price)}
          </p>

          <a
            className="inline-block text-xs font-semibold text-blue-600 hover:underline"
            style={{ marginTop: "6px" }}
          >
            Xem chi tiết
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
      className="rounded-full border border-blue-100 bg-blue-50 text-xs font-medium text-blue-700 hover:bg-blue-100"
      style={{ padding: "6px 10px" }}
    >
      {text}
    </button>
  );
};
