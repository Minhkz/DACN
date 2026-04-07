import React from "react";
import { Carousel } from "antd";
import Image from "next/image";

const contentStyle: React.CSSProperties = {
  margin: 0,
};
const Banner = () => {
  return (
    <div className="container-global">
      <Carousel arrows infinite={true} autoplay autoplaySpeed={2000}>
        <div>
          <h3 style={contentStyle}>
            <Image src="/img/banner.png" alt="Cart" width={1398} height={328} />
          </h3>
        </div>
        <div>
          <h3 style={contentStyle}>
            <Image src="/img/banner.png" alt="Cart" width={1398} height={328} />
          </h3>
        </div>
        <div>
          <h3 style={contentStyle}>
            <Image src="/img/banner.png" alt="Cart" width={1398} height={328} />
          </h3>
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;
