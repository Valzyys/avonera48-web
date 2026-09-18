import Link from "next/link";
import { notFound } from "next/navigation";
import { jkt48, safe } from "@/lib/jkt48";
import { pick, tanggal } from "@/lib/format";
import { Empty } from "@/components/Cards";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: decodeURIComponent(slug).replace(/-/g, " ") };
}

export default async function NewsDetail({ params }: Props) {
  const { slug } = await params;
  const { data, error } = await safe(() =>
    jkt48.getNewsDetail(decodeURIComponent(slug))
  );

  if (!data && error?.includes("gak ketemu")) notFound();

  const n: any = (data as any)?.data ?? data ?? {};
  const judul = pick<string>(n, "title", "judul") ?? "Berita";
  const isi = pick<string>(n, "content", "body", "html", "text") ?? "";

  return (
    <article className="shell section" style={{ maxWidth: 760 }}>
      <p className="meta" style={{ marginBottom: 20 }}>
        <Link href="/news">Berita</Link>
      </p>

      <h1 className="display d2" style={{ marginBottom: 12 }}>
        {judul}
      </h1>
      <p className="meta" style={{ marginBottom: 36 }}>
        {tanggal(pick(n, "date", "published_at", "created_at"))}
      </p>

      {error ? (
        <Empty>{error}</Empty>
      ) : isi ? (
        <div className="prose" dangerouslySetInnerHTML={{ __html: isi }} />
      ) : (
        <Empty>Isi berita belum tersedia.</Empty>
      )}
    </article>
  );
}
