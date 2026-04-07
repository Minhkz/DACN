import React from "react";

type SpecValues = {
  cpu?: string;
  featured?: string;
  ioPorts?: string;
};

const SpecProduct = ({ cpu, featured, ioPorts }: SpecValues) => {
  const rows = [
    { label: "CPU", value: cpu ?? "N/A" },
    { label: "Featured", value: featured ?? "N/A" },
    { label: "I/O Ports", value: ioPorts ?? "N/A" },
  ];

  return (
    <div className={`w-[401px] border border-gray-200 text-sm transition-all`}>
      {rows.map((row, idx) => (
        <div
          key={row.label}
          className={`flex justify-between px-3 py-2 ${idx % 2 === 1 ? "bg-gray-100" : "bg-white"}`}
        >
          <span className="text-gray-800">{row.label}</span>
          <span className="text-gray-500">{row.value}</span>
        </div>
      ))}
    </div>
  );
};

export default SpecProduct;
