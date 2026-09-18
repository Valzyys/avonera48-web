"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="shell section" style={{ minHeight: "60vh" }}>
      <h1 className="display d2">Halaman gagal dimuat</h1>
      <p className="lede" style={{ margin: "16px 0 28px" }}>
        Data dari JKT48Connect gak kebaca barusan. Coba muat ulang — kalau masih
        sama, kemungkinan API key atau kuotanya bermasalah.
      </p>
      <button className="btn" onClick={reset}>
        Muat ulang
      </button>
    </div>
  );
}
