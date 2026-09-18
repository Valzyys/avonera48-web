import { jkt48, safe } from "@/lib/jkt48";
import { arr, pick, tanggal } from "@/lib/format";
import { LiveCard, Empty } from "@/components/Cards";
import { LiveTicker } from "@/components/LiveTicker";

export const dynamic = "force-dynamic";
export const metadata = { title: "Live" };

export default async function LivePage() {
  const [live, recent] = await Promise.all([
    safe(() => jkt48.getLive()),
    safe(() => jkt48.getRecent()),
  ]);

  const liveList = arr(live.data);
  const recentList = arr(recent.data).slice(0, 12);

  return (
    <div className="shell section">
      <div className="section-head">
        <h1 className="display d2">Live sekarang</h1>
        <LiveTicker initial={liveList.length} />
      </div>

      {live.error ? (
        <Empty>{live.error}</Empty>
      ) : liveList.length === 0 ? (
        <Empty>Lagi sepi. Halaman ini nyegerin sendiri tiap 15 detik.</Empty>
      ) : (
        <div className="grid">
          {liveList.map((item: any, i: number) => (
            <LiveCard key={i} item={item} />
          ))}
        </div>
      )}

      <div className="section-head" style={{ marginTop: 64 }}>
        <h2 className="display d3">Baru aja selesai</h2>
      </div>

      {recentList.length === 0 ? (
        <Empty>Belum ada siaran yang selesai hari ini.</Empty>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Platform</th>
              <th>Selesai</th>
            </tr>
          </thead>
          <tbody>
            {recentList.map((r: any, i: number) => (
              <tr key={i}>
                <td>{pick<string>(r, "name", "member.name", "room.name") ?? "-"}</td>
                <td className="muted">
                  {(pick<string>(r, "type", "platform") ?? "-").toUpperCase()}
                </td>
                <td className="muted">
                  {tanggal(pick(r, "ended_at", "end_date", "date", "created_at"))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
