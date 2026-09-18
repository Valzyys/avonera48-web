import { NextResponse } from "next/server";
import { jkt48, safe } from "@/lib/jkt48";
import { arr } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await safe(() => jkt48.getLive());

  if (error) {
    return NextResponse.json({ count: 0, items: [], error }, { status: 200 });
  }

  const items = arr(data);
  return NextResponse.json({ count: items.length, items });
}
