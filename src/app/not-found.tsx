import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell section" style={{ minHeight: "60vh" }}>
      <h1 className="display d1">404</h1>
      <p className="lede" style={{ margin: "16px 0 28px" }}>
        Halaman yang lo cari gak ada. Mungkin link-nya salah ketik, atau
        kontennya udah dipindah.
      </p>
      <Link href="/" className="btn">
        Balik ke beranda
      </Link>
    </div>
  );
}
