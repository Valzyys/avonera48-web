"use client";

import { useEffect, useState } from "react";

/** Polling ringan ke route handler kita sendiri — API key tetap di server. */
export function LiveTicker({ initial }: { initial: number }) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    let alive = true;

    const tick = async () => {
      try {
        const res = await fetch("/api/live", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (alive && typeof json.count === "number") setCount(json.count);
      } catch {
        /* diamkan — jangan ganggu tampilan */
      }
    };

    const id = setInterval(tick, 20000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <span className="pill pill-spot">
      {count > 0 ? `${count} sedang siaran` : "tidak ada siaran"}
    </span>
  );
}
