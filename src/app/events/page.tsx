import { jkt48, safe } from "@/lib/jkt48";
import { arr, pick, tanggal } from "@/lib/format";
import { Empty } from "@/components/Cards";

export const dynamic = "force-dynamic";
export const metadata = { title: "Event" };

export default async function EventsPage() {
  const [events, replay, youtube] = await Promise.all([
    safe(() => jkt48.getEvents()),
    safe(() => jkt48.getReplay()),
    safe(() => jkt48.getYoutube()),
  ]);

  const list = arr(events.data);
  const replays = arr(replay.data).slice(0, 12);
  const videos = arr(youtube.data).slice(0, 12);

  return (
    <div className="shell section">
      <div className="section-head">
        <h1 className="display d2">Event</h1>
      </div>

      {events.error ? (
        <Empty>{events.error}</Empty>
      ) : list.length === 0 ? (
        <Empty>Belum ada event terjadwal.</Empty>
      ) : (
        <div className="grid-wide">
          {list.map((e: any, i: number) => {
            const url = pick<string>(e, "url", "link");
            const inner = (
              <div className="card-body">
                <p className="meta">{tanggal(pick(e, "date", "start_date"))}</p>
                <p className="card-title" style={{ marginTop: 6 }}>
                  {pick<string>(e, "title", "name") ?? "Event"}
                </p>
              </div>
            );
            return url ? (
              <a className="card" key={i} href={url} target="_blank" rel="noreferrer">
                {inner}
              </a>
            ) : (
              <div className="card" key={i}>
                {inner}
              </div>
            );
          })}
        </div>
      )}

      <div className="section-head" style={{ marginTop: 64 }}>
        <h2 className="display d3">Replay siaran</h2>
      </div>
      {replays.length === 0 ? (
        <Empty>Belum ada replay.</Empty>
      ) : (
        <div className="grid-wide">
          {replays.map((r: any, i: number) => (
            <a
              className="card"
              key={i}
              href={pick<string>(r, "url", "link") ?? "#"}
              target="_blank"
              rel="noreferrer"
            >
              <div className="card-body">
                <p className="card-title">
                  {pick<string>(r, "name", "title", "member.name") ?? "Replay"}
                </p>
                <p className="meta">{tanggal(pick(r, "date", "created_at"))}</p>
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="section-head" style={{ marginTop: 64 }}>
        <h2 className="display d3">Video YouTube</h2>
      </div>
      {videos.length === 0 ? (
        <Empty>Belum ada video baru.</Empty>
      ) : (
        <div className="grid-wide">
          {videos.map((v: any, i: number) => {
            const thumb = pick<string>(v, "thumbnail", "img", "image");
            return (
              <a
                className="card"
                key={i}
                href={pick<string>(v, "url", "link") ?? "#"}
                target="_blank"
                rel="noreferrer"
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="thumb thumb-wide" src={thumb} alt="" loading="lazy" />
                ) : null}
                <div className="card-body">
                  <p className="card-title">
                    {pick<string>(v, "title", "name") ?? "Video"}
                  </p>
                  <p className="meta">{tanggal(pick(v, "published_at", "date"))}</p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
