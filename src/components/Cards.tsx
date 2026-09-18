import Link from "next/link";
import { pick } from "@/lib/format";

export function MemberCard({ member }: { member: any }) {
  const name = pick<string>(member, "name", "nickname", "member.name") ?? "Member";
  const img = pick<string>(member, "img_alt", "img", "image", "photo", "avatar");
  const slug =
    pick<string>(member, "slug", "url_key", "member_id", "id") ?? encodeURIComponent(name);
  const room = pick<string>(member, "generation", "group", "jikosokai");

  return (
    <Link href={`/members/${encodeURIComponent(slug)}`} className="card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="thumb" src={img || "/placeholder.jpg"} alt={name} loading="lazy" />
      <div className="card-body">
        <p className="card-title">{name}</p>
        {room ? <p className="meta">{room}</p> : null}
      </div>
    </Link>
  );
}

export function LiveCard({ item }: { item: any }) {
  const name =
    pick<string>(item, "name", "member.name", "room.name", "title") ?? "Live";
  const img = pick<string>(item, "img_alt", "img", "image", "member.img", "thumbnail");
  const type = (pick<string>(item, "type", "platform") ?? "").toUpperCase();
  const viewers = pick<number>(item, "viewers", "views", "total_view");
  const url = pick<string>(item, "url", "stream_url", "link");

  const inner = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="thumb" src={img || "/placeholder.jpg"} alt={name} loading="lazy" />
      <span className="live-dot">LIVE</span>
      <div className="card-body">
        <p className="card-title">{name}</p>
        <p className="meta">
          {type || "STREAM"}
          {viewers ? ` · ${viewers} penonton` : ""}
        </p>
      </div>
    </>
  );

  return url ? (
    <a className="card" href={url} target="_blank" rel="noreferrer">
      {inner}
    </a>
  ) : (
    <div className="card">{inner}</div>
  );
}

export function NewsCard({ item }: { item: any }) {
  const title = pick<string>(item, "title", "judul") ?? "Tanpa judul";
  const slug = pick<string>(item, "slug", "id", "url");
  const date = pick<string>(item, "date", "published_at", "created_at");

  return (
    <Link href={`/news/${encodeURIComponent(slug ?? "")}`} className="card">
      <div className="card-body">
        <p className="meta">{date ?? ""}</p>
        <p className="card-title" style={{ marginTop: 6 }}>
          {title}
        </p>
      </div>
    </Link>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="notice">{children}</div>;
}
