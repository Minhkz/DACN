import Header from "@/component/Header/Header";
import Footer from "@/component/Footer/Footer";
import React from "react";
import Wishlist from "@/component/Wishlist/Wishlist";

export const metadata = {
  title: "My Wishlist | Laptop E-commerce",
  description: "Danh sách sản phẩm yêu thích của bạn",
};

const WishlistPage = () => {
  return (
    <>
      <Header />
      <Wishlist />
      <Footer />
    </>
  );
};

export default WishlistPage;