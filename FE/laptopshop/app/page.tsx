"use client";

import Article from "@/component/Article/Article";
import Brand from "@/component/Brand/Brand";
import Banner from "@/component/Carousel/Banner";
import ChatbotWidget from "@/component/chatbot/ChatbotWidget";
import Footer from "@/component/Footer/Footer";
import Header from "@/component/Header/Header";
import MainProduct from "@/component/Product/MainProduct/MainProduct";
import NewProduct from "@/component/Product/NewProduct/NewProduct";

export default function Home() {
  return (
    <>
      <Header />
      <Banner />
      <NewProduct />
      <MainProduct />
      <Article />
      <Footer />
      <ChatbotWidget />
    </>
  );
}
