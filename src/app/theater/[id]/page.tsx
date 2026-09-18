import Link from "next/link";
import { notFound } from "next/navigation";
import { jkt48, safe } from "@/lib/jkt48";
import { arr, pick, tanggal, idr } from "@/lib/format";
import { Empty } from "@/components/Cards";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Show ${decodeURIComponent(id)}` };
}

export default async function TheaterDetail({ params }: Props) {
  const { id } = await params;
  const { data, error } = await safe(() =>
    jkt48.getTheaterDetail(decodeURIComponent(id))
  );

  if (!data && error?.includes("gak ketemu")) notFound();

  const show: any = (data as any)?.data ?? data ?? {};
  const setlist = pick<string>(show, "setlist", "title", "name") ?? "Pertunjukan";
  const lineup = arr(pick(show, "members", "lineup", "casts"));
  const tiket = arr(pick(show, "tickets", "ticket", "pricing"));

  return (
    <div className="shell section">
      <p className="meta" style={{ marginBottom: 20 }}>
        <Link href="/theater">Theater</Link> / {setlist}
      </p>

      <h1 className="display d2" style={{ marginBottom: 10 }}>
        {setlist}
      </h1>
      <p className="lede" style={{ marginBottom: 40 }}>
        {tanggal(pick(show, "date", "show_date"))}
        {pick<string>(show, "time", "show_time")
          ? ` · ${pick<string>(show, "time", "show_time")}`
          : ""}
      </p>

      {error ? <Empty>{error}</Empty> : null}

      <h2 className="display d3" style={{ marginBottom: 16 }}>
        Line-up
      </h2>
      {lineup.length === 0 ? (
        <div className="notice">Line-up belum diumumkan.</div>
      ) : (
        <div className="grid">
          {lineup.map((m: any, i: number) => {
            const nama = pick<string>(m, "name", "nickname") ?? String(m);
            const img = pick<string>(m, "img_alt", "img", "image");
            return (
              <div className="card" key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="thumb" src={img || "/placeholder.jpg"} alt={nama} loading="lazy" />
                <div className="card-body">
                  <p className="card-title">{nama}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tiket.length > 0 ? (
        <>
          <h2 className="display d3" style={{ margin: "56px 0 16px" }}>
            Harga tiket
          </h2>
          <table className="table">
            <tbody>
              {tiket.map((t: any, i: number) => (
                <tr key={i}>
                  <th style={{ width: 240 }}>
                    {pick<string>(t, "name", "type", "category") ?? "Tiket"}
                  </th>
                  <td>{idr(Number(pick(t, "price", "amount") ?? 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </div>
  );
}
