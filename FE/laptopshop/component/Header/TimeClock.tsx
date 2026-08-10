"use client";

import React, { useEffect, useState } from "react";

function TimeClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
      setDate(
        now.toLocaleDateString("vi-VN", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
        }),
      );
    };

    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="inline-flex items-center gap-2 text-xs"
      style={{ margin: "0", padding: "0" }}
    >
      <span className="relative flex h-2 w-2" style={{ margin: "0", padding: "0" }}>
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
      </span>

      <span
        className="font-mono text-[12px] font-semibold text-slate-200 tracking-wider tabular-nums select-none"
        style={{ margin: "0", padding: "0" }}
      >
        {time || "--:--:--"}
      </span>

      {date && (
        <span
          className="text-[11px] text-slate-400 font-medium hidden md:inline-block border-l border-slate-700/70 select-none"
          style={{ paddingLeft: "8px", marginLeft: "2px", margin: "0 0 0 2px" }}
        >
          {date}
        </span>
      )}
    </div>
  );
}

export default React.memo(TimeClock);
