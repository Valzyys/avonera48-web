"use client";

import { useMemo, useState } from "react";
import { MemberCard } from "@/components/Cards";
import { pick } from "@/lib/format";

export function MemberFilter({ members }: { members: any[] }) {
  const [q, setQ] = useState("");

  const hasil = useMemo(() => {
    const key = q.trim().toLowerCase();
    if (!key) return members;
    return members.filter((m) => {
      const nama = (pick<string>(m, "name", "nickname") ?? "").toLowerCase();
      const gen = (pick<string>(m, "generation", "group") ?? "").toLowerCase();
      return nama.includes(key) || gen.includes(key);
    });
  }, [q, members]);

  return (
    <>
      <label className="field" style={{ maxWidth: 360, marginBottom: 28 }}>
        Cari member
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="nama atau generasi"
          type="search"
        />
      </label>

      {hasil.length === 0 ? (
        <div className="notice">
          Gak ada yang cocok sama &quot;{q}&quot;. Coba kata yang lebih pendek.
        </div>
      ) : (
        <div className="grid">
          {hasil.map((m, i) => (
            <MemberCard key={i} member={m} />
          ))}
        </div>
      )}
    </>
  );
}
