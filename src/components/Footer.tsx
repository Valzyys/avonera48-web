import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <p style={{ margin: "0 0 10px" }}>
          Avonera48 — proyek fans, bukan situs resmi JKT48. Data live, theater,
          dan berita diambil lewat JKT48Connect.
        </p>
        <p style={{ margin: 0 }}>
          <Link href="/live">Live</Link> &nbsp;·&nbsp;{" "}
          <Link href="/members">Member</Link> &nbsp;·&nbsp;{" "}
          <Link href="/theater">Theater</Link> &nbsp;·&nbsp;{" "}
          <Link href="/news">Berita</Link>
        </p>
      </div>
    </footer>
  );
}
