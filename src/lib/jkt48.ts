import "server-only";
import { JKT48Connect, JKT48Error } from "@jkt48connect-id/api";

let client: JKT48Connect | null = null;

/**
 * Di Cloudflare Workers, env var baru ada pas runtime — bukan pas build.
 * Jadi client-nya dibikin malas (lazy), bukan pas modul di-import.
 */
function getClient(): JKT48Connect {
  if (client) return client;

  const apiKey = process.env.JKT48_API_KEY;
  if (!apiKey) {
    throw new Error("JKT48_API_KEY belum diset");
  }

  lient = new JKT48Connect({
    apiKey,
    timeoutMs: 15000,
    retries: 2,
  });
  return client;
}

/** Proxy tipis biar pemakaian di page tetap `jkt48.getLive()` seperti biasa. */
export const jkt48 = new Proxy({} as JKT48Connect, {
  get(_t, prop) {
    const c = getClient() as any;
    const v = c[prop];
    return typeof v === "function" ? v.bind(c) : v;
  },
});

export { JKT48Error };

/** Bungkus panggilan SDK biar halaman gak ikut crash kalau upstream error. */
export async function safe<T>(
  fn: () => Promise<T>
): Promise<{ data: T | null; error: string | null }> {
  try {
    return { data: await fn(), error: null };
  } catch (err) {
    if (err instanceof JKT48Error) {
      return { data: null, error: messageFor(err.code) };
    }
    if (err instanceof Error && err.message.includes("JKT48_API_KEY")) {
      return { data: null, error: "JKT48_API_KEY belum diset di environment." };
    }
    return { data: null, error: "Gagal ambil data. Coba muat ulang." };
  }
}

export function messageFor(code: string): string {
  switch (code) {
    case "VALIDATION":
      return "Input yang dikirim gak valid.";
    case "UNAUTHORIZED":
      return "API key hilang atau salah. Cek JKT48_API_KEY di environment.";
    case "FORBIDDEN":
      return "API key lo gak punya akses ke fitur ini.";
    case "NOT_FOUND":
      return "Data yang dicari gak ketemu.";
    case "RATE_LIMITED":
      return "Kebanyakan request. Tunggu sebentar.";
    case "QUOTA_EXCEEDED":
      return "Kuota plan udah habis.";
    case "TIMEOUT":
      return "Server kelamaan jawab.";
    case "NETWORK":
      return "Koneksi ke server gagal.";
    case "UPSTREAM":
      return "Server JKT48Connect lagi bermasalah.";
    case "ABORTED":
      return "Request dibatalin.";
    case "PARSE":
      return "Format balasan server gak dikenali.";
    default:
      return "Terjadi error yang gak terduga.";
  }
}
