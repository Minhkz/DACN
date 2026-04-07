import React from "react";
import Item from "./Item";
import Brand from "../Brand/Brand";

const Article = () => {
  return (
    <div
      className="container-global "
      style={{ marginBottom: "60px", marginTop: "43px" }}
    >
      <Brand />
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2
          className="text-lg font-semibold mb-6 text-[22px]"
          style={{ marginBottom: "21px", marginTop: "43px" }}
        >
          Theo dõi chúng tôi trên Instagram để cập nhật tin tức, ưu đãi và nhiều
          hơn nữa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <Item src="/article/item1.png" />
          <Item src="/article/item2.png" />
          <Item src="/article/item3.png" />
          <Item src="/article/item4.png" />
          <Item src="/article/item5.png" />
          <Item src="/article/item6.png" />
          <Item src="/article/item7.png" />
          <Item src="/article/item8.png" />
          <Item src="/article/item9.png" />
        </div>
      </section>
    </div>
  );
};

export default Article;
