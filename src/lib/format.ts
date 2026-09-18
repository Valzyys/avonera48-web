export const idr = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n || 0);

export const num = (n: number) => new Intl.NumberFormat("id-ID").format(n || 0);

export const tanggal = (v?: string | number | Date) => {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
};

export const jam = (v?: string | number | Date) => {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

/** Ambil field pertama yang ada — bentuk payload tiap endpoint bisa beda. */
export const pick = <T = any>(obj: any, ...keys: string[]): T | undefined => {
  for (const k of keys) {
    const v = k.split(".").reduce((a: any, p) => (a == null ? a : a[p]), obj);
    if (v !== undefined && v !== null && v !== "") return v as T;
  }
  return undefined;
};

export const arr = <T = any>(v: any): T[] => {
  if (Array.isArray(v)) return v as T[];
  if (!v || typeof v !== "object") return [];
  for (const k of ["data", "items", "results", "list", "members", "news", "events"]) {
    if (Array.isArray(v[k])) return v[k] as T[];
  }
  return [];
};
