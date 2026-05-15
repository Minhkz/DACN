import Checkout from "@/component/Checkout/Checkout";
import Footer from "@/component/Footer/Footer";
import Header from "@/component/Header/Header";
import { Check } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <>
      <Header />
      <Checkout />
      <Footer />
    </>
  );
};

export default page;
