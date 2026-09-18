import Link from "next/link";
import { jkt48, safe } from "@/lib/jkt48";
import { arr, pick, tanggal } from "@/lib/format";
import { Empty } from "@/components/Cards";

export const dynamic = "force-dynamic";
export const metadata = { title: "Theater" };

export default async function TheaterPage() {
  const [theater, idnPlus] = await Promise.all([
    safe(() => jkt48.getTheater({ page: 1 })),
    safe(() => jkt48.getIdnPlus()),
  ]);

  const shows = arr(theater.data);
  const plus = arr(idnPlus.data).slice(0, 10);

  return (
    <div className="shell section">
      <div className="section-head">
        <h1 className="display d2">Jadwal theater</h1>
        <p className="meta">{shows.length} pertunjukan</p>
      </div>

      {theater.error ? (
        <Empty>{theater.error}</Empty>
      ) : shows.length === 0 ? (
        <Empty>Jadwal belum terbit.</Empty>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 190 }}>Tanggal</th>
              <th>Setlist</th>
              <th style={{ width: 110 }}>Jam</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((s: any, i: number) => {
              const id = pick<string>(s, "id", "show_id", "slug") ?? "";
              return (
                <tr key={i}>
                  <td>{tanggal(pick(s, "date", "show_date", "showDate"))}</td>
                  <td>
                    <Link href={`/theater/${encodeURIComponent(id)}`}>
                      {pick<string>(s, "setlist", "title", "name") ?? "Setlist"}
                    </Link>
                  </td>
                  <td className="muted">
                    {pick<string>(s, "time", "show_time") ?? "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="section-head" style={{ marginTop: 64 }}>
        <h2 className="display d3">Show berbayar IDN+</h2>
      </div>

      {plus.length === 0 ? (
        <Empty>Belum ada show IDN+ yang dijadwalkan.</Empty>
      ) : (
        <div className="grid-wide">
          {plus.map((p: any, i: number) => (
            <div className="card" key={i}>
              <div className="card-body">
                <p className="card-title">
                  {pick<string>(p, "title", "name") ?? "IDN+"}
                </p>
                <p className="meta">
                  {tanggal(pick(p, "date", "start_at", "scheduled_at"))}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
