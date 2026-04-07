"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Tag = {
  id: number;
  label: string;
  count: number;
};

export default function FilterTags() {
  const [tags, setTags] = useState<Tag[]>([
    { id: 1, label: "CUSTOM PCS", count: 24 },
    { id: 2, label: "HP/COMPAQ PCS", count: 24 },
  ]);

  const removeTag = (id: number) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
  };

  const clearAll = () => {
    setTags([]);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="flex items-center gap-3
           
           h-[38px]
           bg-gray-100
           border border-gray-300
           rounded-lg"
          style={{ padding: "5px" }}
        >
          <span className="font-semibold text-gray-900 tracking-wide">
            {tag.label}
          </span>
          <span className="text-gray-400">({tag.count})</span>

          <button
            onClick={() => removeTag(tag.id)}
            className="w-7 h-7 flex items-center justify-center
                       bg-red-500 text-white rounded-full
                       hover:bg-red-600 transition"
          >
            <X size={16} />
          </button>
        </div>
      ))}

      {tags.length > 0 && (
        <button
          onClick={clearAll}
          className="px-6 py-3 border border-gray-300 
                     rounded-xl bg-gray-100 
                     hover:bg-gray-200 transition font-medium"
          style={{ padding: "5px" }}
        >
          Clear All
        </button>
      )}
    </div>
  );
}
