import React from "react";

function Pulse({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-neutral-200 ${className}`} />
  );
}

function FilterRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-5">
      <Pulse className="h-6 w-28" />
      <Pulse className="h-4 w-4 rounded-sm" />
    </div>
  );
}

export default function FilterSidebarSkeleton() {
  return (
    <aside className="w-full max-w-[320px] overflow-hidden rounded-[24px] border border-neutral-200 bg-white">
      {/* Header */}
      <div className="px-5 py-6">
        <Pulse className="h-8 w-24" />
      </div>

      <div className="border-t border-neutral-200" />

      {/* Khoảng giá */}
      <div className="px-5 py-6">
        <div className="mb-5">
          <Pulse className="h-7 w-28" />
        </div>

        <div className="flex items-center gap-3">
          <Pulse className="h-12 flex-1 rounded-2xl border border-neutral-200 bg-neutral-100" />
          <Pulse className="h-4 w-3" />
          <Pulse className="h-12 flex-1 rounded-2xl border border-neutral-200 bg-neutral-100" />
        </div>
      </div>

      <div className="border-t border-neutral-200" />

      {/* Accordion rows */}
      <div className="px-5">
        <FilterRowSkeleton />
      </div>
      <div className="border-t border-neutral-200" />

      <div className="px-5">
        <FilterRowSkeleton />
      </div>
      <div className="border-t border-neutral-200" />

      <div className="px-5">
        <FilterRowSkeleton />
      </div>
      <div className="border-t border-neutral-200" />

      <div className="px-5">
        <FilterRowSkeleton />
      </div>
      <div className="border-t border-neutral-200" />

      <div className="px-5">
        <FilterRowSkeleton />
      </div>

      <div className="border-t border-neutral-200" />

      {/* Button */}
      <div className="p-5">
        <Pulse className="h-12 w-full rounded-2xl bg-neutral-300" />
      </div>
    </aside>
  );
}
