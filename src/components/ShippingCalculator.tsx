"use client";

import { useState } from "react";
import { idr } from "@/lib/format";

type District = { id: number | string; name?: string; [k: string]: any };

export function ShippingCalculator() {
  const [asal, setAsal] = useState("");
  const [tujuan, setTujuan] = useState("");
  const [asalList, setAsalList] = useState<District[]>([]);
  const [tujuanList, setTujuanList] = useState<District[]>([]);
  const [asalId, setAsalId] = useState("");
  const [tujuanId, setTujuanId] = useState("");
  const [berat, setBerat] = useState(1000);
  const [rates, setRates] = useState<any[] | null>(null);
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);

  const cari = async (q: string, set: (d: District[]) => void) => {
    if (!q.trim()) return;
    setPesan("");
    const res = await fetch(`/api/shipping?q=${encodeURIComponent(q)}`);
    const json = await res.json();
    if (json.error) {
      setPesan(json.error);
      return;
    }
    set(json.districts ?? []);
    if (!json.districts?.length) setPesan(`Kecamatan untuk "${q}" gak ketemu.`);
  };

  const hitung = async () => {
    if (!asalId || !tujuanId) {
      setPesan("Pilih kecamatan asal dan tujuan dulu.");
      return;
    }
    setLoading(true);
    setPesan("");
    setRates(null);
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originDistrictId: asalId,
          destinationDistrictId: tujuanId,
          weightGram: Number(berat) || 1000,
        }),
      });
      const json = await res.json();
      if (json.error) setPesan(json.error);
      else setRates(json.rates ?? []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ display: "grid", gap: 10 }}>
          <label className="field">
            Kota asal
            <input
              value={asal}
              onChange={(e) => setAsal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && cari(asal, setAsalList)}
              placeholder="Bandung"
            />
          </label>
          <button className="btn btn-ghost" onClick={() => cari(asal, setAsalList)}>
            Cari kecamatan asal
          </button>
          {asalList.length > 0 ? (
            <label className="field">
              Kecamatan asal
              <select value={asalId} onChange={(e) => setAsalId(e.target.value)}>
                <option value="">Pilih kecamatan</option>
                {asalList.map((d) => (
                  <option key={String(d.id)} value={String(d.id)}>
                    {d.name ?? d.id}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <label className="field">
            Kota tujuan
            <input
              value={tujuan}
              onChange={(e) => setTujuan(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && cari(tujuan, setTujuanList)}
              placeholder="Semarang"
            />
          </label>
          <button
            className="btn btn-ghost"
            onClick={() => cari(tujuan, setTujuanList)}
          >
            Cari kecamatan tujuan
          </button>
          {tujuanList.length > 0 ? (
            <label className="field">
              Kecamatan tujuan
              <select
                value={tujuanId}
                onChange={(e) => setTujuanId(e.target.value)}
              >
                <option value="">Pilih kecamatan</option>
                {tujuanList.map((d) => (
                  <option key={String(d.id)} value={String(d.id)}>
                    {d.name ?? d.id}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      </div>

      <label className="field" style={{ maxWidth: 220 }}>
        Berat paket (gram)
        <input
          type="number"
          min={100}
          step={100}
          value={berat}
          onChange={(e) => setBerat(Number(e.target.value))}
        />
      </label>

      <div>
        <button className="btn" onClick={hitung} disabled={loading}>
          {loading ? "Menghitung…" : "Hitung ongkir"}
        </button>
      </div>

      {pesan ? <div className="notice">{pesan}</div> : null}

      {rates ? (
        rates.length === 0 ? (
          <div className="notice">
            Gak ada kurir yang melayani rute ini. Coba kecamatan lain.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Kurir</th>
                <th>Layanan</th>
                <th>Estimasi</th>
                <th>Tarif</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((r: any, i: number) => (
                <tr key={i}>
                  <td>{r.courier ?? r.code ?? "-"}</td>
                  <td className="muted">{r.service ?? r.name ?? "-"}</td>
                  <td className="muted">{r.etd ?? r.estimation ?? "-"}</td>
                  <td>{idr(Number(r.cost ?? r.price ?? 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : null}
    </div>
  );
}
