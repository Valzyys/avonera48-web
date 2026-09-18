import Link from "next/link";
import { notFound } from "next/navigation";
import { jkt48, safe } from "@/lib/jkt48";
import { arr, pick, tanggal, num } from "@/lib/format";
import { Empty } from "@/components/Cards";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: decodeURIComponent(slug) };
}

export default async function MemberDetail({ params }: Props) {
  const { slug } = await params;
  const id = decodeURIComponent(slug);

  const { data, error } = await safe(() => jkt48.getMember(id));
  if (!data && error?.includes("gak ketemu")) notFound();

  const m: any = (data as any)?.data ?? data ?? {};
  const nama = pick<string>(m, "name", "nickname") ?? id;
  const img = pick<string>(m, "img_alt", "img", "image", "photo");
  const roomId = pick<number>(m, "room_id", "roomId", "showroom_id");

  const gifter = roomId
    ? await safe(() => jkt48.getTopGifter({ roomId: Number(roomId) }))
    : { data: null, error: null };
  const gifters = arr(gifter.data).slice(0, 10);

  const detail: [string, any][] = [
    ["Nama panggilan", pick(m, "nickname")],
    ["Generasi", pick(m, "generation", "group")],
    ["Ulang tahun", pick(m, "birthdate", "birthday") ? tanggal(pick(m, "birthdate", "birthday")) : null],
    ["Tinggi", pick(m, "height") ? `${pick(m, "height")} cm` : null],
    ["Golongan darah", pick(m, "bloodType", "blood_type")],
    ["Room ID", roomId],
  ];

  return (
    <div className="shell section">
      <p className="meta" style={{ marginBottom: 20 }}>
        <Link href="/members">Member</Link> / {nama}
      </p>

      {error ? <Empty>{error}</Empty> : null}

      <div
        style={{
          display: "grid",
          gap: 36,
          gridTemplateColumns: "minmax(0, 300px) minmax(0, 1fr)",
          alignItems: "start",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="thumb" src={img || "/placeholder.jpg"} alt={nama} />

        <div>
          <h1 className="display d2" style={{ marginBottom: 14 }}>
            {nama}
          </h1>

          {pick<string>(m, "jikosokai", "catchphrase") ? (
            <p className="lede" style={{ marginBottom: 24 }}>
              {pick<string>(m, "jikosokai", "catchphrase")}
            </p>
          ) : null}

          <table className="table" style={{ marginBottom: 40 }}>
            <tbody>
              {detail
                .filter(([, v]) => v !== undefined && v !== null && v !== "")
                .map(([k, v]) => (
                  <tr key={k}>
                    <th style={{ width: 180 }}>{k}</th>
                    <td>{String(v)}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <h2 className="display d3" style={{ marginBottom: 16 }}>
            Top gifter
          </h2>
          {gifters.length === 0 ? (
            <div className="notice">
              Belum ada data gift buat member ini.
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Gold</th>
                </tr>
              </thead>
              <tbody>
                {gifters.map((g: any, i: number) => (
                  <tr key={i}>
                    <td>{pick<string>(g, "name", "user.name", "username") ?? "-"}</td>
                    <td className="muted">
                      {num(Number(pick(g, "gold", "total_gold", "point") ?? 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
