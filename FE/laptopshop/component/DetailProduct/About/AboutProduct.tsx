import React from "react";

const AboutProduct = ({ desc }: { desc: string }) => {
  return <p className="font-normal text-[18px] transition-all">{desc}</p>;
};

export default AboutProduct;
