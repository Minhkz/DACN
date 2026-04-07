"use client";

import Image from "next/image";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function TetSalePortal({ open, onClose }: Props) {
  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/70
        transition-opacity duration-300
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}
      `}
    >
      {/* Click ngoài để đóng */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Banner */}
      <div
        className={`
          relative z-10
          w-[320px] sm:w-[380px] md:w-[420px]
          transform transition-all duration-300 ease-out
          ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-20 w-8 h-8
                     rounded-full bg-white text-black font-bold
                     flex items-center justify-center shadow"
        >
          ✕
        </button>

        {/* Image */}
        <Image
          src="/img/portal.png"
          alt="Tết AI Sale"
          width={500}
          height={700}
          className="w-full h-auto"
          priority
        />
      </div>
    </div>
  );
}
