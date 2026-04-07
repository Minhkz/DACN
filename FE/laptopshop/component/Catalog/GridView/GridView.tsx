import CardProduct from "@/component/Product/CardProduct/CardProduct";
import { Pagination } from "@mui/material";
import React from "react";

const GridView = () => {
  return (
    <div className="container mx-auto px-4">
      <div
        className="
          grid gap-8
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
        "
      >
        <CardProduct />
        <CardProduct />
        <CardProduct />
        <CardProduct />
        <CardProduct />
      </div>
      <div
        className="flex justify-center mt-4 sm:mt-6 lg:mt-8"
        style={{ marginTop: "25px" }}
      >
        <Pagination count={10} shape="rounded" />
      </div>
    </div>
  );
};

export default GridView;
