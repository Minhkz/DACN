import React from "react";

type DetailListProps = {
  items: string[];
};

export default function DetailList({ items }: DetailListProps) {
  return (
    <ul
      className="list-disc pl-5 space-y-2 font-normal text-[14px] text-gray-700 transition-all"
      style={{ paddingLeft: "18px" }}
    >
      {items.map((text, idx) => (
        <li key={idx}>{text}</li>
      ))}
    </ul>
  );
}
