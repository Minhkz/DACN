import React from "react";
import Item from "./Item";
import { Pagination } from "@mui/material";

const ListView = () => {
  return (
    <div
      className="
      w-full
      px-3
      sm:px-4
      lg:px-0
    "
    >
      <div className="flex flex-col gap-5">
        <Item />
        <Item />
        <Item />
        <Item />
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

export default ListView;
