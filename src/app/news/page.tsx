import { jkt48, safe } from "@/lib/jkt48";
import { arr } from "@/lib/format";
import { NewsCard, Empty } from "@/components/Cards";

export const dynamic = "force-dynamic";
export const metadata = { title: "Berita" };

type Props = { searchParams: Promise<{ page?: string }> };

export default async function NewsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);

  const { data, error } = await safe(() => jkt48.getNews({ page }));
  const list = arr(data);

  return (
    <div className="shell section">
      <div className="section-head">
        <h1 className="display d2">Berita</h1>
        <p className="meta">Halaman {page}</p>
      </div>

      {error ? (
        <Empty>{error}</Empty>
      ) : list.length === 0 ? (
        <Empty>Gak ada berita di halaman ini.</Empty>
      ) : (
        <div className="grid-wide">
          {list.map((n: any, i: number) => (
            <NewsCard key={i} item={n} />
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
        {page > 1 ? (
          <a className="btn btn-ghost" href={`/news?page=${page - 1}`}>
            Sebelumnya
          </a>
        ) : null}
        {list.length > 0 ? (
          <a className="btn btn-ghost" href={`/news?page=${page + 1}`}>
            Selanjutnya
          </a>
        ) : null}
      </div>
    </div>
  );
}
