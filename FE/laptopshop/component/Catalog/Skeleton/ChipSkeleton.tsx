"use client";

import React from "react";

function Pulse({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-slate-200/85 ${className}`} />
  );
}

function FilterRowSkeleton() {
  return (
    <div
      className="flex items-center justify-between"
      style={{ paddingTop: "20px", paddingBottom: "20px" }}
    >
      <Pulse className="h-6 w-28 rounded-lg" />
      <Pulse className="h-4 w-4 rounded-md" />
    </div>
  );
}

export default function FilterSidebarSkeleton() {
  return (
    <aside className="w-full max-w-[320px] overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm">
      {/* Header */}
      <div
        style={{
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "24px",
          paddingBottom: "24px",
        }}
      >
        <Pulse className="h-8 w-24 rounded-lg" />
      </div>

      <div className="border-t border-slate-100" />

      {/* Khoảng giá */}
      <div
        style={{
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "24px",
          paddingBottom: "24px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <Pulse className="h-7 w-28 rounded-lg" />
        </div>

        <div className="flex items-center gap-3">
          <Pulse className="h-12 flex-1 rounded-xl border border-slate-100 bg-slate-50/50" />
          <Pulse className="h-4 w-3 rounded" />
          <Pulse className="h-12 flex-1 rounded-xl border border-slate-100 bg-slate-50/50" />
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Accordion rows */}
      <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <FilterRowSkeleton />
      </div>
      <div className="border-t border-slate-100" />

      <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <FilterRowSkeleton />
      </div>
      <div className="border-t border-slate-100" />

      <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <FilterRowSkeleton />
      </div>
      <div className="border-t border-slate-100" />

      <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <FilterRowSkeleton />
      </div>
      <div className="border-t border-slate-100" />

      <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <FilterRowSkeleton />
      </div>

      <div className="border-t border-slate-100" />

      {/* Button */}
      <div style={{ padding: "20px" }}>
        <Pulse className="h-12 w-full rounded-xl bg-slate-300" />
      </div>
    </aside>
  );
}
