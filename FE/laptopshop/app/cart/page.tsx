"use client";

import Header from "@/component/Header/Header";
import Footer from "@/component/Footer/Footer";
import Link from "next/link";
import { useMemo, useState } from "react";
import Cart from "@/component/Cart/Cart";

export default function CartPage() {
  return (
    <>
      <Header />
      <Cart />
      <Footer />
    </>
  );
}
