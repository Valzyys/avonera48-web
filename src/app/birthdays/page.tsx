import { jkt48, safe } from "@/lib/jkt48";
import { arr, pick, tanggal } from "@/lib/format";
import { Empty } from "@/components/Cards";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ulang tahun" };

export default async function BirthdaysPage() {
  const { data, error } = await safe(() => jkt48.getBirthdays());
  const list = arr(data);

  return (
    <div className="shell section">
      <div className="section-head">
        <h1 className="display d2">Ulang tahun</h1>
        <p className="meta">{list.length} member</p>
      </div>

      {error ? (
        <Empty>{error}</Empty>
      ) : list.length === 0 ? (
        <Empty>Gak ada ulang tahun dalam waktu dekat.</Empty>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Member</th>
              <th style={{ width: 220 }}>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {list.map((b: any, i: number) => (
              <tr key={i}>
                <td>{pick<string>(b, "name", "member.name") ?? "-"}</td>
                <td className="muted">
                  {tanggal(pick(b, "birthdate", "birthday", "date"))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
