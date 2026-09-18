import { NextResponse } from "next/server";
import { jkt48, safe } from "@/lib/jkt48";
import { arr } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/shipping?q=Bandung — cari kecamatan */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ error: "Isi nama kotanya dulu." }, { status: 400 });
  }

  const { data, error } = await safe(() => jkt48.getShippingDistricts(q));
  if (error) return NextResponse.json({ error }, { status: 200 });

  return NextResponse.json({ districts: arr(data) });
}

/** POST /api/shipping — hitung tarif */
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body-nya bukan JSON." }, { status: 400 });
  }

  const originDistrictId = Number(body.originDistrictId);
  const destinationDistrictId = Number(body.destinationDistrictId);
  const weightGram = Number(body.weightGram) || 1000;

  if (!originDistrictId || !destinationDistrictId) {
    return NextResponse.json(
      { error: "Kecamatan asal dan tujuan wajib diisi." },
      { status: 400 }
    );
  }

  const { data, error } = await safe(() =>
    jkt48.getShippingCost({
      originDistrictId,
      destinationDistrictId,
      weightGram,
    })
  );

  if (error) return NextResponse.json({ error }, { status: 200 });

  return NextResponse.json({ rates: arr(data) });
}
