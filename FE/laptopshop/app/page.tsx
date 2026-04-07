"use client";
import Article from "@/component/Article/Article";
import Brand from "@/component/Brand/Brand";
import Banner from "@/component/Carousel/Banner";
import Footer from "@/component/Footer/Footer";
import Header from "@/component/Header/Header";
import TetSalePortal from "@/component/Portal/TetSalePortal";
import MainProduct from "@/component/Product/MainProduct/MainProduct";
import NewProduct from "@/component/Product/NewProduct/NewProduct";
import { useEffect, useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 1500);
  }, []);

  return (
    <>
      <TetSalePortal open={open} onClose={() => setOpen(false)} />
      <Header />
      <Banner />
      <NewProduct />
      <MainProduct />
      <Article />
      <Footer />
    </>
  );
}
