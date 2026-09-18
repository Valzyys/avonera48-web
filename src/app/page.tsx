import Link from "next/link";
import { jkt48, safe } from "@/lib/jkt48";
import { arr, tanggal, pick } from "@/lib/format";
import { ParallaxHero } from "@/components/ParallaxHero";
import { LiveCard, NewsCard, Empty } from "@/components/Cards";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [live, news, theater, birthdays] = await Promise.all([
    safe(() => jkt48.getLive()),
    safe(() => jkt48.getNews({ page: 1 })),
    safe(() => jkt48.getTheater({ page: 1 })),
    safe(() => jkt48.getBirthdays()),
  ]);

  const liveList = arr(live.data);
  const newsList = arr(news.data).slice(0, 6);
  const shows = arr(theater.data).slice(0, 4);
  const ultah = arr(birthdays.data).slice(0, 6);

  return (
    <>
      <ParallaxHero liveCount={liveList.length} />

      <section className="section" id="live">
        <div className="shell">
          <div className="section-head">
            <h2 className="display d2">Lagi siaran</h2>
            <Link href="/live" className="muted">
              Semua live
            </Link>
          </div>

          {live.error ? (
            <Empty>{live.error}</Empty>
          ) : liveList.length === 0 ? (
            <Empty>
              Belum ada member yang siaran. Balik lagi nanti sore — jam segitu
              biasanya rame.
            </Empty>
          ) : (
            <div className="grid">
              {liveList.map((item: any, i: number) => (
                <LiveCard key={i} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <h2 className="display d2">Jadwal theater</h2>
            <Link href="/theater" className="muted">
              Semua jadwal
            </Link>
          </div>

          {theater.error ? (
            <Empty>{theater.error}</Empty>
          ) : shows.length === 0 ? (
            <Empty>Jadwal belum terbit.</Empty>
          ) : (
            <table className="table">
              <tbody>
                {shows.map((s: any, i: number) => {
                  const id = pick<string>(s, "id", "show_id", "slug");
                  return (
                    <tr key={i}>
                      <td style={{ width: 180 }}>
                        {tanggal(pick(s, "date", "show_date", "showDate"))}
                      </td>
                      <td>
                        <Link href={`/theater/${encodeURIComponent(id ?? "")}`}>
                          {pick<string>(s, "setlist", "title", "name") ?? "Setlist"}
                        </Link>
                      </td>
                      <td className="muted" style={{ width: 120 }}>
                        {pick<string>(s, "time", "show_time") ?? ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <h2 className="display d2">Kabar terbaru</h2>
            <Link href="/news" className="muted">
              Semua berita
            </Link>
          </div>

          {news.error ? (
            <Empty>{news.error}</Empty>
          ) : newsList.length === 0 ? (
            <Empty>Belum ada berita baru.</Empty>
          ) : (
            <div className="grid-wide">
              {newsList.map((n: any, i: number) => (
                <NewsCard key={i} item={n} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <h2 className="display d2">Ulang tahun dekat</h2>
            <Link href="/birthdays" className="muted">
              Semua tanggal
            </Link>
          </div>

          {ultah.length === 0 ? (
            <Empty>Gak ada ulang tahun dalam waktu dekat.</Empty>
          ) : (
            <div className="grid-wide">
              {ultah.map((b: any, i: number) => (
                <div className="card" key={i}>
                  <div className="card-body">
                    <p className="card-title">
                      {pick<string>(b, "name", "member.name") ?? "Member"}
                    </p>
                    <p className="meta">
                      {tanggal(pick(b, "birthdate", "birthday", "date"))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
