# Avonera48

Situs fans JKT48 pakai Next.js 15 (App Router) + Once UI, data dari
`@jkt48connect-id/api`. Hero-nya video full-screen yang menyusut jadi banner
sticky waktu di-scroll.

## Jalanin lokal

```bash
npm install
cp .dev.vars.example .dev.vars   # isi JKT48_API_KEY
npm run dev
```

## Deploy ke Cloudflare Workers

```bash
npx wrangler secret put JKT48_API_KEY   # sekali aja
npm run deploy
```

Key-nya disimpan sebagai secret Worker, bukan di `wrangler.jsonc`. Buat lokal
pakai `.dev.vars`; keduanya sama-sama muncul di `process.env.JKT48_API_KEY`.

Preview build Workers tanpa deploy: `npm run preview`.

Taruh video hero di `public/hero.mp4` dan poster di `public/hero-poster.jpg`,
plus `public/placeholder.jpg` buat foto yang kosong. Mau pakai file lain,
ganti `NEXT_PUBLIC_HERO_VIDEO` / `NEXT_PUBLIC_HERO_POSTER` di `.env`.

## Halaman

| Route | Isi |
|---|---|
| `/` | Hero parallax, live, jadwal theater, berita, ulang tahun |
| `/live` | Live sekarang + siaran yang baru selesai, ticker auto-refresh |
| `/members` | Roster lengkap dengan pencarian |
| `/members/[slug]` | Profil member + top gifter |
| `/theater` | Jadwal theater + show IDN+ |
| `/theater/[id]` | Setlist, line-up, harga tiket |
| `/news` | Berita dengan paging |
| `/news/[slug]` | Isi artikel |
| `/events` | Event, replay, video YouTube |
| `/birthdays` | Daftar ulang tahun |
| `/shipping` | Kalkulator ongkir merch |

## Kenapa API key gak pernah bocor

`src/lib/jkt48.ts` diimpor pakai `server-only`, jadi file itu gak mungkin
kebawa ke bundle browser. Komponen client (ticker live, kalkulator ongkir)
nembak ke route handler sendiri di `/api/live` dan `/api/shipping`, bukan ke
JKT48Connect langsung.

## Cara hero-nya jalan

`ParallaxHero` ngitung progress scroll jadi satu variabel CSS `--p` (0 = video
penuh, 1 = banner). Semua ukuran, radius, dan opacity di `globals.css`
diturunkan dari `--p`, jadi cuma ada satu nilai yang dianimasikan dan gak ada
layout thrash. Kalau browser minta `prefers-reduced-motion`, transisinya
dimatiin dan hero-nya langsung jadi blok statis.

## Catatan bentuk data

Field tiap endpoint bisa beda-beda nama. Helper `pick()` dan `arr()` di
`src/lib/format.ts` yang nanganin itu — kalau lo tau nama field pastinya,
tinggal ganti langsung di komponennya biar lebih ketat.


## Catatan Cloudflare

- Client SDK dibikin lazy di `src/lib/jkt48.ts`. Di Workers, env var baru ada
  pas runtime — kalau client-nya diinisialisasi waktu modul di-import, build
  langsung gagal karena key-nya masih kosong.
- Semua halaman yang narik data pakai `force-dynamic`, jadi gak butuh ISR
  cache Workers. Kalau mau ISR, tambahin binding R2/KV lewat
  `defineCloudflareConfig({ incrementalCache: ... })` di `open-next.config.ts`.
- `images.unoptimized: true` karena optimizer bawaan Next gak jalan di Workers.
- Cache per-request diserahin ke SDK (opsinya `noCache`, bukan `cache`), jadi
  gue gak oper opsi apa-apa di route handler.
