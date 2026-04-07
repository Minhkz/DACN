import Image from "next/image";
import React from "react";

type Props = {
  src: string;
};
const Item = (props: Props) => {
  return (
    <div className="group">
      <div className="overflow-hidden">
        <Image src={props.src} alt="article" width={235} height={152} />
      </div>
      <p className="text-sm text-gray-600 mt-3 leading-relaxed">
        Nếu bạn vừa mua PC để bàn hoặc laptop, bạn có thể cân nhắc bổ sung các
        phụ kiện để nâng cấp góc làm việc tại nhà, dàn gaming hoặc không gian
        làm việc kinh doanh của mình…
      </p>

      <span className="block text-xs text-gray-400 mt-2">01.09.2020</span>
    </div>
  );
};

export default Item;
