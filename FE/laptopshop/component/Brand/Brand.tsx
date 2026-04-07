import Image from "next/image";
import React from "react";

const Brand = () => {
  return (
    <div className="flex justify-between items-center gap-3 flex-wrap">
      <Image src="/logo/roccat.png" alt="roccat" width={153} height={80} />
      <Image src="/logo/msi.png" alt="msi" width={153} height={80} />
      <Image src="/logo/razer.png" alt="razer" width={153} height={80} />
      <Image
        src="/logo/thermaltake.png"
        alt="thermaltake"
        width={153}
        height={80}
      />
      <Image src="/logo/adata.png" alt="adata" width={153} height={80} />
      <Image src="/logo/hp.png" alt="hp" width={153} height={80} />
      <Image src="/logo/gigabyte.png" alt="gigabyte" width={153} height={80} />
    </div>
  );
};

export default Brand;
