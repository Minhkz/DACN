import Header from "@/component/Header/Header";
import Footer from "@/component/Footer/Footer";
import Catalog from "@/component/Catalog/Catalog";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<div>Đang tải...</div>}>
        <Catalog />
      </Suspense>
      <Footer />
    </>
  );
}
